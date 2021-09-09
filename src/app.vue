<template>
    <v-app id="wrapper"
    :style='"background: url(" + (darkMode? require("./assets/bg-dark.jpg") : require("./assets/bg-light.jpg")) + ") no-repeat fixed center;"'
    >
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
import { mapState, mapActions } from 'vuex';
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
            "userData",
            "progress",
            "darkMode"
        ]),
    },
    methods: {
        ...mapActions([
            "setDarkMode",
            "setAppMode",
        ]),
        onScroll (e) {
            if (typeof window === 'undefined') return;
            const top = window.pageYOffset ||   e.target.scrollTop || 0;
            this.fab = top > 20;
        },
        toTop () {
            this.$vuetify.goTo(0);
        },
    },
    watch: {
        darkMode(bool) {
            this.setDarkMode(bool);
        },
    },                                                          
    beforeMount() {
        this.setDarkMode(this.userData.dark? true : false);
    },
}
</script>

<style lang="scss">
#wrapper {
    scroll-behavior: smooth;
    background-size: 100vw 100vh !important;
}
.ck.ck-editor__main>.ck-editor__editable {
    min-height: 150px;
    background: unset !important;
}
</style>
