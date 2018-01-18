<template>
    <div>
        <div class="row">
            <router-link :to="{name: 'new'}" class="p-button--positive u-float-right">
                <i class="fa fa-plus"></i>
                New Recipe
            </router-link>

            <form class="p-form p-form--inline">
                <div class="p-form__group">
                    <label for="search" class="p-form__label">Search</label>
                    <input type="text" id="search" class="p-form__control" v-model="term" />
                </div>
            </form>
        </div>

        <div class="row center u-clearfix" v-if="loading">
            <i class="fa fa-spinner fa-spin fa-4x"></i>
        </div>

        <div class="row u-clearfix" v-if="!loading">
            <ul class="p-matrix u-clearfix">
                <li v-for="result in results" class="p-matrix__item">
                    <img
                        class="p-matrix__img"
                        :src="result.proxyImage"
                        :alt="result.title"
                        @click="$router.push({name: 'view', params: {id: result.id}})"
                        v-if="result.image"
                    />

                    <div class="p-matrix__content">
                        <h3 class="p-matrix__title">
                            <router-link class="p-matrix__link" :to="{name: 'view', params: {id: result.id}}">{{result.title}}</router-link>
                        </h3>

                        <p class="p-matrix__desc">
                            {{result.description}}
                        </p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import storage from '@/storage';

export default {
    name: 'List',
    data() {
        return {
            loading: true,
            results: [],
            term: '',
        };
    },
    created() {
        this.search();

        this.$bus.$on('reload', () => {
            this.search();
        });
    },
    methods: {
        search() {
            this.loading = true;
            storage.search(this.term).then((results) => {
                this.results = results.map((result) => {
                    result.proxyImage = `https://images.weserv.nl/?url=${encodeURI(result.image).replace('http://', '').replace('https://', '')}`;
                    return result;
                });
                this.loading = false;
            });
        },
    },
    watch: {
        term() {
            // TODO debounce
            this.search();
        },
    },
};
</script>

<style scoped>
.row {
    margin-top: 0.5em;
}

.p-form {
    margin-top: 0;
}
</style>
