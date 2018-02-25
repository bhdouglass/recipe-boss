import 'font-awesome/css/font-awesome.min.css';

import Vue from 'vue';
import VueHead from 'vue-head';
import VModal from 'vue-js-modal';
import App from './App';
import router from './router';
import EventBus from './bus';
import StarRating from './components/StarRating';

Vue.config.productionTip = false;

Object.defineProperties(Vue.prototype, {
    $bus: {
        get: function() {
            return EventBus;
        },
    },
});

Vue.use(VueHead, {
    separator: '-',
    complement: 'Recipe Boss',
});
Vue.use(VModal);

Vue.component('star-rating', StarRating);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: (h) => {
        return h(App);
    },
});
