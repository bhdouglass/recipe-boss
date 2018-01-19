import uuid from 'uuid/v4';
import RemoteStorage from 'remotestoragejs';
import EventBus from './bus';

let Recipe = {
    name: 'recipes',
    builder: function(privateClient) {
        privateClient.declareType('recipe', {
            type: 'object',
            properties: {
                title: {type: 'string'},
                source: {type: 'string'},
                description: {type: 'string'},
                ingredients: {type: 'string'},
                directions: {type: 'string'},
                notes: {type: 'string'},
                prep_time: {type: 'number'},
                total_time: {type: 'number'},
                image: {type: 'string'},
                rating: {type: 'number'},
            },
            required: [
                'title',
                'ingredients',
            ],
        });

        return {
            exports: {
                init: () => {
                    privateClient.cache('');
                },

                on: privateClient.on,

                add: (recipe) => {
                    return privateClient.storeObject('recipe', recipe.id, recipe);
                },

                find: privateClient.getObject.bind(privateClient),

                delete: privateClient.remove.bind(privateClient),

                list: () => {
                    return privateClient.getAll('');
                },
            },
        };
    },
};

let remoteStorage = new RemoteStorage({
    changeEvents: {local: true, remote: true},
    modules: [Recipe],
    logging: (process.env.NODE_ENV == 'development'),
    cache: false, // TODO figure out why caching doesn't update with getAll
});
remoteStorage.access.claim('recipes', 'rw');
remoteStorage.setApiKeys({
    dropbox: process.env.DROPBOX_KEY,
    googledrive: process.env.GOOGLE_DRIVE_KEY,
});

let metadata = {};
function loadMetadata() {
    return remoteStorage.recipes.list().then((recipes) => {
        Object.values(recipes).forEach((recipe) => {
            if (recipe.id) {
                metadata[recipe.id] = {
                    id: recipe.id,
                    image: recipe.image,
                    title: recipe.title,
                    description: recipe.description,
                };
            }
        });

        return metadata;
    });
}

let readyPromise = loadMetadata();

remoteStorage.on('disconnected', () => {
    metadata = {};

    EventBus.$emit('reload');
});

remoteStorage.on('connected', () => {
    readyPromise = loadMetadata().then(() => {
        EventBus.$emit('reload');
    });
});

remoteStorage.recipes.on('change', () => {
    readyPromise = loadMetadata().then(() => {
        EventBus.$emit('reload');
    });
});

export default {
    remoteStorage: remoteStorage,

    save(recipe) {
        if (!recipe.id) {
            let id = uuid();
            recipe.id = id;
        }

        metadata[recipe.id] = {
            id: recipe.id,
            image: recipe.image,
            title: recipe.title,
            description: recipe.description,
        };

        return remoteStorage.recipes.add(recipe).then(() => {
            return recipe;
        });
    },
    remove(id) {
        delete metadata[id];

        return remoteStorage.recipes.delete(id);
    },
    find(id) {
        return remoteStorage.recipes.find(id);
    },
    search(term) {
        return readyPromise.then(() => {
            let results = [];
            let metadataValues = Object.values(metadata);
            for (let i = 0; i < metadataValues.length; i++) {
                let result = metadataValues[i];

                if (term) {
                    if (
                        result.title.toLowerCase().indexOf(term.toLowerCase()) >= 0 ||
                        result.description.toLowerCase().indexOf(term.toLowerCase()) >= 0
                    ) {
                        results.push(result);
                    }
                }
                else {
                    results.push(result);
                }
            }

            results = results.sort((a, b) => {
                if (a.title > b.title) {
                    return 1;
                }
                else if (a.title < b.title) {
                    return -1;
                }

                return 0;
            });

            return results;
        });
    },
};
