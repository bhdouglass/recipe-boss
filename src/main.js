import 'font-awesome/css/font-awesome.min.css';

import Vue from 'vue';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: (h) => {
        return h(App);
    },
});
