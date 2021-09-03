<template>
    <v-app id="wrapper">
        <!--header-->
        <appbar></appbar>
        <v-main tag="main">
            <section>
                <v-container fluid>
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
        dark
        fixed
        bottom
        right
        color="primary"
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
    }
}
</script>

<style lang="scss" scoped>
#wrapper {
    background: url("./assets/bg.jpg") no-repeat fixed center;
    background-size: 100vw 100vh;
}
</style>
