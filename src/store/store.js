import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userData: null,
        publications: [],
        comments: [],
        notifs: [],
        drawer: false,
    },
    mutations: {
        SET_USER_DATA(state, payload) {
            state.userData = payload;
        },
        SET_PUBLICATIONS(state, payload) {
            state.publications = payload;
        },
        SET_COMMENTS(state, payload) {
            state.comments = payload;
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
        setPublications(context, payload) {
            context.commit("SET_PUBLICATIONS", payload);
        },
        setComments(context, payload) {
            context.commit("SET_COMMENTS", payload);
        },
        setNotifs(context, payload) {
            context.commit("SET_NOTIFS", payload);  
        },
        toggleDrawer(context) {
            context.commit("TOGGLE_DRAWER");
        },
    },
    modules: {
    },
    plugins: [createPersistedState()],
});







