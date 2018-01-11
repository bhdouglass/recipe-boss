import uuid from 'uuid/v4';

let metadata = window.localStorage.getItem('metadata');
if (metadata) {
    metadata = JSON.parse(metadata);
}
else {
    metadata = {};
}

// Implementing these as promises to easily swap out the backend later
export default {
    save(recipe) {
        return new Promise((resolve) => {
            if (!recipe.id) {
                recipe.id = uuid();
            }

            window.localStorage.setItem(recipe.id, JSON.stringify(recipe));

            metadata[recipe.id] = {
                id: recipe.id,
                image: recipe.image,
                title: recipe.title,
                description: recipe.description,
            };

            window.localStorage.setItem('metadata', JSON.stringify(metadata));
            resolve(recipe);
        });
    },
    remove(id) {
        return new Promise((resolve) => {
            window.localStorage.removeItem(id);

            delete metadata[id];
            window.localStorage.setItem('metadata', JSON.stringify(metadata));

            resolve();
        });
    },
    find(id) {
        return new Promise((resolve, reject) => {
            let recipe = window.localStorage.getItem(id);
            try {
                recipe = JSON.parse(recipe);
            }
            catch (e) {
                recipe = null;
            }

            if (recipe) {
                resolve(recipe);
            }
            else {
                reject();
            }
        });
    },
    search(term) {
        return new Promise((resolve) => {
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

            resolve(results);
        });
    },
};
