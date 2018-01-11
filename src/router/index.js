import Vue from 'vue';
import Router from 'vue-router';
import List from '@/components/List';
import Edit from '@/components/Edit';
import View from '@/components/View';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'list',
            component: List,
        }, {
            path: '/new',
            name: 'new',
            component: Edit,
        }, {
            path: '/edit/:id',
            name: 'edit',
            component: Edit,
        }, {
            path: '/view/:id',
            name: 'view',
            component: View,
        },
    ],
});
