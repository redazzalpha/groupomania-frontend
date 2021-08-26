<template>
    <v-app id="wrapper">
        <!--header-->
        <appbar></appbar>
        <v-main>
            <v-container fluid>
                <progressBar :model="progress"></progressBar>
                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import { mapState } from 'vuex';
import appbar from "./components/appbar.vue";
import progressBar from "./components/progressBar.vue";
export default {
    components: {
        appbar,
        progressBar,
    },
    computed: {
        ...mapState([
            "progress",
        ])
    },
}
</script>
