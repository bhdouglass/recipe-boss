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
            ],
        });

        return {
            exports: {
                init: () => {
                    privateClient.cache('/');
                },

                on: privateClient.on,

                add: (recipe) => {
                    return privateClient.storeObject('recipe', recipe.id, recipe);
                },

                find: privateClient.getObject.bind(privateClient),

                delete: privateClient.remove.bind(privateClient),

                list: () => {
                    return privateClient.getAll('/');
                },
            },
        };
    },
};

if (process.env.NODE_ENV != 'development') {
    // Hack the redirect url so we don't try to redirect to a file:// url
    // AND so the redirect url isn't the full domain + path
    RemoteStorage.Authorize.getLocation = function() {
        // Emulate window.location
        function Location(href) {
            this.href = href;
        }

        Location.prototype.toString = function() {
            return this.href;
        };

        return new Location(`https://recipes.bhdouglass.com/${window.location.hash}`);
    };
}

let remoteStorage = new RemoteStorage({
    changeEvents: {local: true, remote: true},
    modules: [Recipe],
    // logging: (process.env.NODE_ENV == 'development'),
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
                    rating: recipe.rating,
                };
            }
        });

        window.localStorage.setItem('metadata', JSON.stringify(metadata));
        return metadata;
    });
}

let localStorageMetadata = window.localStorage.getItem('metadata');
if (localStorageMetadata) {
    try {
        metadata = JSON.parse(localStorageMetadata);
    }
    catch (e) {
        metadata = {};
    }
}

remoteStorage.on('disconnected', () => {
    metadata = {};
    window.localStorage.removeItem('metadata');

    EventBus.$emit('reload');
});

remoteStorage.on('connected', () => {
    loadMetadata().then(() => {
        EventBus.$emit('reload');
    });
});

remoteStorage.recipes.on('change', () => {
    loadMetadata().then(() => {
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

        if (recipe.total_time) {
            recipe.total_time = parseInt(recipe.total_time, 10);
            if (isNaN(recipe.total_time)) {
                recipe.total_time = null;
            }
        }

        if (recipe.prep_time) {
            recipe.prep_time = parseInt(recipe.prep_time, 10);
            if (isNaN(recipe.prep_time)) {
                recipe.prep_time = null;
            }
        }

        return remoteStorage.recipes.add(recipe).then(() => {
            metadata[recipe.id] = {
                id: recipe.id,
                image: recipe.image,
                title: recipe.title,
                description: recipe.description,
                rating: recipe.rating,
            };
            window.localStorage.setItem('metadata', JSON.stringify(metadata));

            return recipe;
        });
    },
    remove(id) {
        return remoteStorage.recipes.delete(id).then(() => {
            delete metadata[id];
            window.localStorage.setItem('metadata', JSON.stringify(metadata));
        });
    },
    find(id) {
        return remoteStorage.recipes.find(id);
    },
    search(term) {
        return new Promise((resolve) => {
            let results = [];
            let metadataValues = Object.values(metadata);
            for (let i = 0; i < metadataValues.length; i++) {
                let result = metadataValues[i];

                if (term) {
                    let title = result.title ? result.title.toLowerCase() : '';
                    let description = result.description ? result.description.toLowerCase() : '';

                    if (
                        title.indexOf(term.toLowerCase()) >= 0 ||
                        description.indexOf(term.toLowerCase()) >= 0
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

            resolve(results);
        });
    },

    refresh() {
        return loadMetadata();
    },
};
