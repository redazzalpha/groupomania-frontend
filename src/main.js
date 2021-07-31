import Vue from "vue";
import app from './app.vue';
import router from './router/router';
import store from './store/store';
import vuetify from './plugins/vuetify';
import vueRessource from 'vue-resource';

Vue.use(vueRessource);
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    vuetify,
    render: h => h(app),
}).$mount('#app');
