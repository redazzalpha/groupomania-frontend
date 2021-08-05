<template>
    <!--navbar-collapse-->
    <v-navigation-drawer app
    v-model="$store.state.drawer"
    absolute
    temporary
    >
        <v-list-item>
            <v-list-item-avatar>
                <v-img v-if="0==1" :src="userData.img"></v-img>
                <v-icon v-else color="primary">mdi-account-circle</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
            <v-list-item-title>redazzwolf</v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>
            <v-list-item
            v-for="item in items"
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

import defines from "../defines/define";
export default {
    name: "navbar",
    data() {
        return {
            userData: null,
            items: [
                { title: 'Accueil', url: defines.HOME_URL, icon: 'mdi-home' },
                { title: 'Mon profil', url: defines.PROFIL_URL, icon: 'mdi-account' },
                { title: 'Se déconnecter', url: defines.LOGOUT_URL, icon: 'mdi-logout' },
            ],
        };
    },
}
</script>

