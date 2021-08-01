import Vue from "vue";
import app from './app.vue';
import router from './router/router';
import store from './store/store';
import vuetify from './plugins/vuetify';
import vueRessource from 'vue-resource';

Vue.use(vueRessource);
Vue.http.interceptors.push(function (req) {
    
    req.headers.set("Accept", "application/json");
    req.headers.set("Content-Type", "application/json");
    
    if (localStorage.grpm_store != null && localStorage.grpm_store != undefined) {
        const grpm_store =  JSON.parse(localStorage.grpm_store);
        req.headers.set("Authorization", `Bearer ${grpm_store.data.token}`);
    }
});
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    vuetify,
    render: h => h(app),
}).$mount('#app');
