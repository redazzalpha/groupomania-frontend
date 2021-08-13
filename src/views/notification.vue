<template>
    <auth tab="notification" :auth_url="auth_url"  @onReady="trigger">
        <slot v-if="showPage">
            <h2 class="pa-5">Notifications</h2>
            <div v-if="empty" class="text-center title">Vous n'avez pas de notifications</div>
            <v-hover v-for="item in notifs" :key="item.comId" style="overflow: hidden">
                <template v-slot:default="{ hover }">
                <v-card  shaped color="grey lighten-2" max-width=550 class="mx-auto mb-5 transition-swing" :elevation="hover ? 11 : 4">
                    <v-container class="pb-0">
                        <v-row no-gutters>
                            <v-col class="flex-grow-0">
                                <v-avatar size=60>
                                    <v-img v-if="item.img" :src="item.img"  />
                                    <v-icon v-else size=60 color="primary">mdi-account-circle</v-icon>
                                </v-avatar>
                            </v-col>
                            <v-col>
                                    <v-container class="py-2">
                                    <v-row no-gutters>
                                        <v-col>
                                            <v-card-text class="pa-0">{{ item.pseudo}} a commenté votre publication.</v-card-text>
                                        </v-col>
                                    </v-row>
                                    <v-row no-gutters>
                                        <v-col>
                                            <v-card-text class="pa-0 font-italic">{{ item.time.substring(0,20) }}</v-card-text>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-col>
                            <v-col class="d-flex flex-grow-0 align-center">
                                <v-btn
                                icon 
                                color="grey lighten-1"
                                title="Supprimer la notification"
                                class="pr-3"
                                @click="delNotif(item.notifId)"
                                >
                                    <v-icon>mdi-close-circle</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-expansion-panels>
                        <v-expansion-panel>
                            <v-expansion-panel-header color="grey lighten-2" @click="readNotif(item)">
                                <v-icon color="primary">mdi-comment-processing</v-icon>
                                <!--
                                <v-badge :value="notifCount" :dot="!hover" :content="notifCount" color="warning">
                                    --->
                                <v-badge :dot="!hover" :value="item.state == 'unread'" content="Nouveau" color="warning" style="position: absolute; left: 50%; top: 20px;"></v-badge>
                                </v-expansion-panel-header>
                            <v-expansion-panel-content color="grey lighten-2">{{ item.text }}</v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card>
                </template>
            </v-hover>
        </slot>
    </auth>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import auth from "../components/auth.vue";
import defines from "../defines/define";
export default {
    name: "notification",
    components: {
        auth,
    },
    data() {
        return {
            auth_url: `${defines.SERVER_URL}${defines.NOTIFICATION_URL}`, 
            showPage: false,
            hover: false,
            empty: false,
        };
    },
    computed: {
        ...mapState(["notifs"]),
    },
    methods: {
        ...mapActions(["setNotifs"]),
        getNotifs() {
            return new Promise((resolve, reject) => {
                this.$http.get(`${defines.SERVER_URL}${defines.NOTIFICATION_URL}`)
                .then(
                    (success) => {
                        this.setNotifs(success.body.results);
                        this.empty = !this.notifs.length >= 1;
                        resolve();
                    },
                    (failed) => { reject(failed); }
                );
            });
        },
        readNotif(item) {

            if(item.state == "unread") {
                this.$http.post(`${defines.SERVER_URL}${defines.READ_NOTIFICATION_URL}`, {notifId: item.notifId})
                .then(
                    (/*success*/) => this.refresh(), 
                    (/*failed*/) => {alert("failed")} 
                );
            }
        },
        delNotif(notifId) {

            this.$http.post(`${defines.SERVER_URL}${defines.DEL_NOTIFICATION_URL}`, {notifId})
            .then(
                (/*success*/) => this.refresh(), 
                (/*failed*/) => {alert("failed")} 
            );
        },
        refresh() {
            this.getNotifs();
        },
        // function used for show or unshow home view
        trigger(ready) {
            this.showPage = ready;                                                                                                                         
        },
    },
    mounted() {
        this.refresh();
    },
}
</script>
