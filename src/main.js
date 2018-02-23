import 'font-awesome/css/font-awesome.min.css';

import Vue from 'vue';
import VueHead from 'vue-head';
import App from './App';
import router from './router';
import EventBus from './bus';

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

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: (h) => {
        return h(App);
    },
});
