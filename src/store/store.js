import Vue from 'vue';
import Vuex from 'vuex';
import services from "../services/store.service";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        drawer: null,
    },
    mutations: {
        TOGGLE_DRAWER: services.TOGGLE_DRAWER,
    },
    actions: {
        toggleDrawer: services.toggleDrawer,
    },
    modules: {
    }
});







