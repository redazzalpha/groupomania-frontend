import Vue from "vue";
import app from './app.vue';
import router from './router/router';
import store from './store/store';
import vuetify from './plugins/vuetify';
import vueRessource from 'vue-resource';
import CKEditor from '@ckeditor/ckeditor5-vue2';
//import CKEditor from 'ckeditor4-vue';

Vue.use(CKEditor);
Vue.use(vueRessource);
Vue.http.interceptors.push(function (req) {
    //set interceptor headers
    req.headers.set("Accept", "application/json");
    req.headers.set("Content-Type", "application/json");
    //add bearer token
    const grpm_store =  JSON.parse(localStorage.grpm_store);
    if (grpm_store.data != null && grpm_store.data != undefined) {
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
