<template>
    <div class="row">
        <div class="back">
            <router-link :to="{name: 'list'}"><i class="fa fa-chevron-left"></i></router-link>
            <router-link :to="{name: 'list'}">Back</router-link>
        </div>

        <div class="row center" v-if="loading">
            <i class="fa fa-spinner fa-spin fa-4x"></i>
        </div>

        <div v-if="!loading">
            <div class="p-card">
                <header class="p-card__header" v-if="recipe.image">
                    <img :src="image" :alt="recipe.title">
                </header>

                <h3 class="p-card__title">
                    {{recipe.title}}

                    <!-- TODO make this a component -->
                    <i class="fa" :class="{'fa-star': recipe.rating >= 1, 'fa-star-o': recipe.rating < 1}"></i>
                    <i class="fa" :class="{'fa-star': recipe.rating >= 2, 'fa-star-o': recipe.rating < 2}"></i>
                    <i class="fa" :class="{'fa-star': recipe.rating >= 3, 'fa-star-o': recipe.rating < 3}"></i>
                    <i class="fa" :class="{'fa-star': recipe.rating >= 4, 'fa-star-o': recipe.rating < 4}"></i>
                    <i class="fa" :class="{'fa-star': recipe.rating >= 5, 'fa-star-o': recipe.rating < 5}"></i>
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
                        <a @click="remove()">
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
                        <li v-for="(direction, index) in directions">
                            {{direction}}
                        </li>
                    </ol>
                </p>
            </div>

            <div class="p-card" v-if="recipe.notes">
                <h3 class="p-card__title">Notes</h3>
                <p class="p-card__content pre">{{recipe.notes}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import storage from '@/storage';
import utils from '@/utils';

export default {
    name: 'ViewRecipe',
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
                this.recipe = recipe;
                this.loading = false;
            });
            // TODO error handling
        },
        remove() {
            // TODO confirm delete
            storage.remove(this.$route.params.id).then(() => {
                this.$router.push({name: 'list'});
            });
        },
    },
    computed: {
        ingredients() {
            let ingredients = [];
            if (this.recipe) {
                ingredients = this.recipe.ingredients.split('\n').filter((ingredient) => {
                    return ingredient.trim();
                });

                ingredients = ingredients.map((ingredient) => {
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
            if (this.recipe) {
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
