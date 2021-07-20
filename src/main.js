import Vue from "vue";
import app from './app.vue';
import router from './router/router';
import store from './store/store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    vuetify,
    render: h => h(app)
}).$mount('#app');
