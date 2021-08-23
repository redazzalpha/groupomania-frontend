<template>
    <v-app id="wrapper">
        <!--header-->
        <hdr />
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
import hdr from "./components/header.vue";
import progressBar from "./components/progressBar.vue";
export default {
    components: {
        hdr,
        progressBar,
    },
    computed: {
        ...mapState([
            "progress",
        ])
    },
}
</script>
