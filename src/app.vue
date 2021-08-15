<template>
    <v-app id="wrapper">
        <!--header-->
        <hdr />
        <v-main>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import defines from "./defines/define";
import hdr from "./components/header.vue";
export default {
    components: {
        hdr,
    },
    computed: {
        ...mapState(["userData", "publications", "notifs",]),
    },
    methods: {
        ...mapActions(["setUserData", "setPublications", "setNotifs"]),
        getPubs() {
            return new Promise((resolve, reject) => {
                // get request
                this.$http.get(`${defines.SERVER_URL}${defines.PUBLISH_URL}`)
                .then(
                    (success) => {
                        this.setPublications(success.body.results);
                        resolve();
                    },
                    (failed) => {
                        reject(failed);
                    }
                );
            });
        },
        getComs() {
            return new Promise((resolve, reject) => {
                // get request
                this.$http.get(`${defines.SERVER_URL}${defines.COMMENT_URL}`)
                .then(
                    (success) => {
                        this.comments = success.body.results;
                        resolve();
                    },
                    (failed) => {reject(failed);}
                );
            });
        },
        getNotifs() {
            return new Promise((resolve, reject) => {
                this.$http.get(`${defines.SERVER_URL}${defines.NOTIFICATION_URL}`)
                .then(
                    (success) => {
                        const notifs = success.body.results.filter(item => item.whereId == this.userData.userId);
                        this.setNotifs(notifs);
                        resolve();
                    },
                    (failed) => { reject(failed); }
                );
            });
        },
        refresh() {
            this.getPubs()
                .then( () => {
                    this.getComs()
                        .then( () => {
                            this.getNotifs()
                        })
                        .catch();
                })
                .catch();
        },
    },
    mounted() {
        this.refresh();
    },
}
</script>
