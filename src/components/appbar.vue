<template>
    <v-app-bar 
    app 
    height=114
    tag="header"
    :color="darkMode? '#212121': 'primary'" 
    :dark='darkMode'
    class="d-flex flex-column" 
    >
        <v-container fluid>
            <!--logo-row-->
            <v-row no-gutters>
                <v-col id='imgCtr'>
                    <img 
                    class="header-logo" 
                    width="70%" 
                    alt="header logo" 
                    :src='darkMode?require("../assets/header_logo-dark.svg"):require("../assets/header_logo-light.svg")' 
                    style="max-width: 300px;" />
                </v-col>
            </v-row>
            <!--toolbar-row-->
            <v-row 
            justify="center" 
            no-gutters 
            :style="'background-color:' + (darkMode?'#444444':'#3F51B5')"
            >
                <!--navbar-toggler-button-->
                <v-col cols="2" class="d-flex justify-center">
                    <v-app-bar-nav-icon @click.stop="drawer = !drawer" title="Menu"></v-app-bar-nav-icon>
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
        </v-container>
        <!--navbar-collapse-->
        <v-navigation-drawer
        app
        v-model="drawer"
        absolute
        temporary
        tag="nav"
        >
            <v-list-item>
                <v-list-item-avatar>
                        <avatar :item="userData" :size=40></avatar>
                </v-list-item-avatar>

                <v-list-item-content>
                <v-list-item-title v-if="userData">{{ userData.pseudo }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense>
                <v-list-item
                v-for="item in listItems"
                :key="item.title"
                :to="item.url"
                >
                    <v-list-item-icon tag="button">
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </v-app-bar >
</template>

<script>
import { mapState } from "vuex";
import defines from "../defines/define";
import avatar from "../components/avatar.vue";
export default {
    name: "appbar",
    components: {
        avatar,
    },
    data() {
        return {
            defines: defines,
            hover: false,
            drawer: false,
            listItems: [
                { title: 'Accueil', url: defines.HOME_URL, icon: 'mdi-home' },
                { title: 'Mon profil', url: defines.PROFIL_URL, icon: 'mdi-account' },
                { title: 'Se déconnecter', url: defines.LOGOUT_URL, icon: 'mdi-logout' },
            ],
        };
    },
    computed: {
        ...mapState([
            "userData",
            "notifs",
            "darkMode",
        ]),
        getUserImg() {
            if(this.userData)
                return this.userData.img;
            return null;
        },
        notifCount() {
            if(this.notifs)
                return this.notifs.filter(item => item.state === "unread").length;
            return 0;
        }
    },
}
</script>
