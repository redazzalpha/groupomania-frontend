import Vue from 'vue';
import Vuex from 'vuex';
import services from "../services/store.service";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        drawer: null,
        postAnswer: "",
        getAnswer: "",
    },
    mutations: {
        TOGGLE_DRAWER: services.TOGGLE_DRAWER,
        SET_POST_ANSWER: services.SET_POST_ANSWER,
        SET_GET_ANSWER: services.SET_GET_ANSWER,
    },
    actions: {
        toggleDrawer: services.toggleDrawer,
        post: services.post,
        get: services.get,
    },
    modules: {
    }
});







