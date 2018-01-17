<template>
    <div class="row">
        <div class="back">
            <router-link :to="{name: 'list'}"><i class="fa fa-chevron-left"></i></router-link>
            <router-link :to="{name: 'list'}">Back</router-link>
        </div>

        <h1 v-if="is_new">New Recipe</h1>
        <h1 v-else>Edit Recipe</h1>

        <div class="row center" v-if="loading">
            <i class="fa fa-spinner fa-spin fa-4x"></i>
        </div>

        <div class="row" v-if="!loading">
            <form class="p-form p-form--stacked">
                <div class="p-form__group">
                    <label for="title" class="p-form__label">Title</label>
                    <input type="text" id="title" class="p-form__control" :disabled="saving" v-model="recipe.title" />
                </div>

                <div class="p-form__group">
                    <label for="source" class="p-form__label">Source</label>
                    <input type="url" id="source" class="p-form__control" :disabled="saving" v-model="recipe.source" />
                </div>

                <a @click="extract()" class="p-button--positive" v-if="is_new && !error">Extract Recipe</a>

                <div class="p-form__group">
                    <label for="description" class="p-form__label">Description</label>
                    <textarea id="description" class="p-form__control" :disabled="saving" v-model="recipe.description" rows="2"></textarea>
                </div>

                <div class="p-form__group">
                    <label for="ingredients" class="p-form__label">Ingredients</label>
                    <textarea id="ingredients" class="p-form__control" :disabled="saving" v-model="recipe.ingredients" rows="10"></textarea>
                </div>

                <div class="p-form__group">
                    <label for="directions" class="p-form__label">Directions</label>
                    <textarea id="directions" class="p-form__control" :disabled="saving" v-model="recipe.directions" rows="10"></textarea>
                </div>

                <div class="p-form__group">
                    <label for="notes" class="p-form__label">Notes</label>
                    <textarea id="notes" class="p-form__control" :disabled="saving" v-model="recipe.notes" rows="5"></textarea>
                </div>

                <div class="p-form__group">
                    <label for="prep_time" class="p-form__label">Prep Time</label>
                    <input type="number" id="prep_time" class="p-form__control" :disabled="saving" v-model="recipe.prep_time" min="0" />
                </div>

                <div class="p-form__group">
                    <label for="total_time" class="p-form__label">Total Time</label>
                    <input type="number" id="total_time" class="p-form__control" :disabled="saving" v-model="recipe.total_time" min="0" />
                </div>

                <div class="p-form__group">
                    <label for="image" class="p-form__label">Image</label>
                    <input type="url" id="image" class="p-form__control" :disabled="saving" v-model="recipe.image" />
                </div>

                <!-- TODO star rating -->
            </form>

            <a class="p-button--positive" @click="save()" :disabled="saving">
                <i class="fa" :class="{'fa-save': !saving, 'fa-spinner fa-spin': saving}"></i>
                Save
            </a>

            <router-link class="p-button--neutral" :to="{name: 'list'}" :disabled="saving">
                <i class="fa fa-times"></i>
                Cancel
            </router-link>
        </div>
    </div>
</template>

<script>
import storage from '@/storage';
import api from '@/api';

export default {
    name: 'Edit',
    data() {
        return {
            is_new: !this.$route.params.id,
            recipe: {},
            saving: false,
            loading: false,
            error: false,
        };
    },
    created() {
        if (this.$route.params.id) {
            this.load();
        }
    },
    methods: {
        load() {
            this.loading = true;
            storage.find(this.$route.params.id).then((recipe) => {
                this.recipe = recipe;
                this.loading = false;
            });
            // TODO error handling
        },
        save() {
            this.saving = true;

            storage.save(this.recipe).then((recipe) => {
                this.saving = false;
                this.$router.push({name: 'view', params: {id: recipe.id}});
            });
        },
        extract() {
            if (this.recipe.source) {
                this.loading = true;
                api.extract(this.recipe.source).then((recipe) => {
                    this.recipe = recipe;
                    this.loading = false;
                }).catch(() => {
                    this.loading = false;
                    this.error = true;
                });
            }
        },
    },
};
</script>

<style scoped>
.row {
    margin-top: 0.5em;
}

h1 {
    margin-top: 2rem;
}
</style>
