<template>
    <!--navbar-collapse-->
    <v-navigation-drawer app
    v-model="$store.state.showNav"
    absolute
    temporary
    >
        <v-list-item>
            <v-list-item-avatar>
                <v-img v-if="getUserImg" :src="getUserImg"></v-img>
                <v-icon v-else color="primary">mdi-account-circle</v-icon>
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
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
import defines from "../defines/define";
export default {
    name: "navbar",
    data() {
        return {
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
        ]),
        getUserImg() {
            if(this.userData)
                return this.userData.img;
            return null;
        },
    },
}
</script>

