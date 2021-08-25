<template>
    <v-toolbar color="indigo">
        <v-row justify="center">
            <!--navbar-toggler-button-->
            <v-col cols="2" class="d-flex justify-center">
                <v-app-bar-nav-icon @click.stop="$store.state.showNav = !$store.state.showNav" title="Menu"></v-app-bar-nav-icon>
            </v-col>
            <!--toolbar-icons-->
            <v-col cols="2" class="d-flex justify-center">
                <v-btn icon dark :to="defines.PROFIL_URL" title="Mon profil"><v-icon>mdi-account</v-icon></v-btn>
            </v-col>
            <v-col cols="2" class="d-flex justify-center">
                <v-hover v-model="hover">
                    <v-btn 
                    icon dark 
                    :to="defines.NOTIFICATION_URL" 
                    title="Mes notifications"
                    >
                        <v-badge :value="notifCount" :dot="!hover" :content="notifCount" color="warning">
                                <v-icon>mdi-bell-ring</v-icon>
                        </v-badge>
                    </v-btn>
                </v-hover>
            </v-col>
            <v-col cols="2" class="d-flex justify-center">
                <v-btn icon dark :to="defines.TEAM_URL" title="Voir l'équipe"><v-icon>mdi-account-group</v-icon></v-btn>
            </v-col>
            <v-col cols="2" class="d-flex justify-center">
                <v-btn icon dark :to="defines.LOGOUT_URL" title="Se déconnecter"><v-icon>mdi-logout</v-icon></v-btn>
            </v-col>
        </v-row>
    </v-toolbar>
</template>

<script>
import { mapState } from "vuex";
import defines from "../defines/define";
export default {
    name: "toolbar",
    data() {
        return {
            defines: defines,
            hover: false,
        };
    },
    computed: {
        ...mapState([
            "notifs",
        ]),
        notifCount() {
            if(this.notifs)
                return this.notifs.filter(item => item.state === "unread").length;
            return 0;
        }
    },
}
</script>

