import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userData: null,
        notifs: [],
        drawer: false,
    },
    mutations: {
        SET_USER_DATA(state, payload) {
            state.userData = payload;
        },
        SET_NOTIFS(state, payload) {
            state.notifs = payload;
        },
        TOGGLE_DRAWER(state) {
            state.drawer = !state.drawer;
        },
    },
    actions: {
        setUserData(context, payload) {
            context.commit("SET_USER_DATA", payload);
        },
        setNotifs(context, payload) {
            context.commit("SET_NOTIFS", payload);  
        },
        toggleDrawer(context) {
            context.commit("TOGGLE_DRAWER");
        },
    },
    modules: {
    }
});







