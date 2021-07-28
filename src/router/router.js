import Vue from 'vue';
import VueRouter from 'vue-router';
import defines from '../defines/define';
import register from '../views/register.vue';
import home from '../views/home.vue';
import profil from '../views/profil.vue';
import team from '../views/team.vue';
import notification from '../views/notification.vue';
import logout from '../views/logout.vue';
import notfound from '../views/notfound.vue';

Vue.use(VueRouter);

const routes = [
    {
        name: "root",
        path: defines.ROOT_URL,
        redirect: defines.REGISTER_URL,
        component: register,
    },
    {
        name: 'register',
        path: defines.REGISTER_URL,
        component: register
    },
    {
        name: 'home',
        path: `${defines.HOME_URL}/:id`,
        component: home
    },
    {
        name: 'profil',
        path: defines.PROFIL_URL,
        component: profil
    },
    {
        name: 'team',
        path: defines.TEAM_URL,
        component: team
    },
    {
        name: 'notification',
        path: defines.NOTIFICATION_URL,
        component: notification
    },
    {
        name: 'logout',
        path: defines.LOGOUT_URL,
        component: logout
    },
    {
        name: "notFound",
        path: "/*",
        component: notfound
    }
];

const router = new VueRouter({
    routes,
    mode: "history",
});


export default router;
