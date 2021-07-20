import Vue from 'vue';
import VueRouter from 'vue-router';
import register from '../views/register.vue';
import home from '../views/home.vue';
import signup from '../views/signup.vue';
import profil from '../views/profil.vue';
import team from '../views/team.vue';
import notification from '../views/notification.vue';
import logout from '../views/logout.vue';
import insertimg from '../views/insertimg.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'register',
        component: register
    },
    {
        path: '/home',
        name: 'home',
        component: home
    },
    {
        path: '/signup',
        name: 'signup',
        component: signup
    },
    {
        path: '/profil',
        name: 'profil',
        component: profil
    },
    {
        path: '/team',
        name: 'team',
        component: team
    },
    {
        path: '/notification',
        name: 'notification',
        component: notification
    },
    {
        path: '/logout',
        name: 'logout',
        component: logout
    },
    {
        path: '/insert/img',
        name: 'insertimg',
        component: insertimg
    },
];

const router = new VueRouter({
    routes,
    mode: "history",
});


export default router;
