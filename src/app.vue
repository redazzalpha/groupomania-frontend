<template>
    <v-app id="wrapper">
        <!--header-->
        <appbar></appbar>
        <!--main-block-->
        <v-main tag="main">
            <section>
                <v-container fluid>
                    <!--progress- loding-bar-->
                    <progressBar tag="progress" :model="progress"></progressBar>
                    <router-view></router-view>
                </v-container>
            </section>
        </v-main>
        <ftr tag="footer"></ftr>
        <!--scroll-top-button-->
        <v-btn
        v-scroll="onScroll"
        v-show="fab"
        fab
        fixed
        bottom
        right
        :color='darkMode? "" : "primary"'
        :dark='darkMode'
        tab="button"
        @click="toTop"
        >
            <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
    </v-app>
</template>

<script>
import { mapState } from 'vuex';
import appbar from "./components/appbar.vue";
import progressBar from "./components/progressBar.vue";
import ftr from "./components/footer.vue";
export default {
    components: {
        appbar,
        progressBar,
        ftr,
    },
    data() {
        return {
            fab:false,
        };
    },
    computed: {
        ...mapState([
            "progress",
            "darkMode"
        ])
    },
    methods: {
        onScroll (e) {
            if (typeof window === 'undefined') return;
            const top = window.pageYOffset ||   e.target.scrollTop || 0;
            this.fab = top > 20;
        },
        toTop () {
            this.$vuetify.goTo(0);
        },
        setThemeMode() {
            const wrapper = document.querySelector('#wrapper');
            if(this.darkMode) {
                wrapper.classList.remove('bg-light');
                wrapper.classList.add('bg-dark');
            }
            else{
                wrapper.classList.remove('bg-dark');
                wrapper.classList.add('bg-light');
            }
        },
    },
    watch: {
        darkMode() {
            this.setThemeMode();
        },
    },
    mounted() {
        const wrapper = document.querySelector('.theme--light.v-application');
        wrapper.classList.remove('theme--light');
        this.setThemeMode();
    },
}
</script>

<style lang="scss" scoped>
#wrapper {
    background-size: 100vw 100vh !important;
}
.bg-light{
    background: url("./assets/bg-light.jpg") no-repeat fixed center !important;
}
.bg-dark{
    background: url("./assets/bg-dark.jpg") no-repeat fixed center !important;
}
</style>
