<template>
    <div class="row">
        <router-link :to="{name: 'new'}" class="p-button--positive u-float-right">
            <i class="fa fa-plus"></i>
            New Recipe
        </router-link>

        <div class="back">
            <router-link :to="{name: 'list'}"><i class="fa fa-chevron-left"></i></router-link>
            <router-link :to="{name: 'list'}">Back</router-link>
        </div>

        <div class="row center" v-if="loading">
            <i class="fa fa-spinner fa-spin fa-4x"></i>
        </div>

        <div v-if="!loading">
            <div class="p-card">
                <header class="p-card__header" v-if="recipe && recipe.image">
                    <img :src="image" :alt="recipe.title">
                </header>

                <h3 class="p-card__title">
                    {{recipe.title}}

                    <span v-if="recipe.rating">
                        <!-- TODO make this a component -->
                        <i class="fa" :class="{'fa-star': recipe.rating >= 1, 'fa-star-o': recipe.rating < 1}"></i>
                        <i class="fa" :class="{'fa-star': recipe.rating >= 2, 'fa-star-o': recipe.rating < 2}"></i>
                        <i class="fa" :class="{'fa-star': recipe.rating >= 3, 'fa-star-o': recipe.rating < 3}"></i>
                        <i class="fa" :class="{'fa-star': recipe.rating >= 4, 'fa-star-o': recipe.rating < 4}"></i>
                        <i class="fa" :class="{'fa-star': recipe.rating >= 5, 'fa-star-o': recipe.rating < 5}"></i>
                    </span>
                </h3>
                <p class="p-card__content" v-if="recipe.description">{{recipe.description}}</p>

                <ul class="p-inline-list--middot">
                    <li class="p-inline-list__item" v-if="recipe.prep_time">
                        Prep Time: {{recipe.prep_time}}
                    </li>
                    <li class="p-inline-list__item" v-if="recipe.total_time">
                        Total Time: {{recipe.total_time}}
                    </li>
                </ul>
                <ul class="p-inline-list--middot">
                    <li class="p-inline-list__item" v-if="recipe.source && (recipe.source.startsWith('https://') || recipe.source.startsWith('http://'))">
                        <a :href="recipe.source">
                            Source <i class="fa fa-external-link"></i>
                        </a>
                    </li>
                    <li class="p-inline-list__item" v-if="recipe.source && !recipe.source.startsWith('https://') && !recipe.source.startsWith('http://')">
                        Source: {{recipe.source}}
                    </li>

                    <li class="p-inline-list__item">
                        <router-link :to="{name: 'edit', params: {id: recipe.id}}">
                            Edit <i class="fa fa-edit"></i>
                        </router-link>
                    </li>
                    <li class="p-inline-list__item">
                        <a @click="confirmRemove()">
                            Delete <i class="fa fa-remove"></i>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="p-card">
                <h3 class="p-card__title">Ingredients</h3>
                <p class="p-card__content">
                    <ul class="p-list">
                        <li class="p-list__item" v-for="ingredient in ingredients" v-html="ingredient"></li>
                    </ul>
                </p>
            </div>

            <div class="p-card" v-if="recipe.directions">
                <h3 class="p-card__title">Directions</h3>
                <p class="p-card__content">
                    <ol>
                        <li v-for="(direction, index) in directions" v-html="direction"></li>
                    </ol>
                </p>
            </div>

            <div class="p-card" v-if="recipe.notes">
                <h3 class="p-card__title">Notes</h3>
                <p class="p-card__content pre">{{recipe.notes}}</p>
            </div>
        </div>

        <modal name="confirm-remove">
            <div class="p-strip">
                <h3>
                    Are you sure your want to delete this recipe?
                </h3>

                <button class="p-button--neutral" @click="$modal.hide('confirm-remove')">Cancel</button>
                <button class="p-button--negative" @click="remove()">Delete</button>
            </div>
        </modal>

        <modal name="error-message">
            <div class="p-strip">
                <h3>
                    Error: {{errorMessage}}
                </h3>

                <button class="p-button--neutral" @click="closeErrorMessage()">Ok</button>
            </div>
        </modal>
    </div>
</template>

<script>
import storage from '@/storage';
import utils from '@/utils';

export default {
    name: 'ViewRecipe',
    head: {
        title: function() {
            return {inner: this.recipe ? this.recipe.title : ''};
        },
    },
    data() {
        return {
            recipe: {},
            loading: false,
        };
    },
    created() {
        this.loading = true;
        this.load();

        this.$bus.$on('reload', () => {
            this.load();
        });
    },
    methods: {
        load() {
            storage.find(this.$route.params.id).then((recipe) => {
                console.log(recipe);
                if (recipe) {
                    this.recipe = recipe;

                    this.$emit('updateHead');
                }
                else {
                    this.errorMessage = 'Recipe not found.';
                    this.$modal.show('error-message');
                }

                this.loading = false;
            }).catch((err) => {
                console.error(err);
                if (err.getMessage) {
                    this.errorMessage = err.getMessage();
                }
                else {
                    this.errorMessage = err;
                }

                this.$modal.show('error-message');
            });
        },
        confirmRemove() {
            this.$modal.show('confirm-remove');
        },
        remove() {
            this.closeConfirmRemove();

            storage.remove(this.$route.params.id).then(() => {
                this.$router.push({name: 'list'});
            });
        },
        closeErrorMessage() {
            this.$modal.hide('error-message');
            this.$router.push({name: 'list'});
        },
    },
    computed: {
        ingredients() {
            let ingredients = [];
            if (this.recipe && this.recipe.ingredients) {
                ingredients = this.recipe.ingredients.split('\n').filter((ingredient) => {
                    return ingredient.trim();
                });

                ingredients = ingredients.map((ingredient) => {
                    if (ingredient[0] == '#') {
                        return `<h4>${ingredient.substring(1).trim()}<h4>`;
                    }

                    let parts = ingredient.split(' ').map((part) => {
                        if (!isNaN(part.replace('/', ''))) {
                            return `<b>${part}</b>`;
                        }

                        return part;
                    });
                    return parts.join(' ');
                });
            }

            return ingredients;
        },
        directions() {
            let directions = [];
            if (this.recipe && this.recipe.directions) {
                directions = this.recipe.directions.split('\n').filter((direction) => {
                    return direction.trim();
                });
            }

            return directions;
        },
        image() {
            let image = '';
            if (this.recipe && this.recipe.image) {
                image = utils.imageUrl(this.recipe.image);
            }

            return image;
        },
    },
};
</script>

<style scoped>
.back {
    margin-top: 0.5em;
}

.row {
    margin-top: 0.5em;
}

.p-card .p-card__header img {
    max-height: 20em;
}

.pre {
    white-space: pre-line;
}

span {
    display: inline-block;
    margin-right: 1em;
}
</style>
