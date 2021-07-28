<template>
    <v-toolbar color="indigo">
        <v-row justify="center">
            <!--navbar-toggler-button-->
            <v-col cols="2" class="d-flex justify-center">
                <v-app-bar-nav-icon @click.stop="toggleDrawer" title="Menu"></v-app-bar-nav-icon>
            </v-col>
            <!--toolbar icons-->
            <v-col cols="2" class="d-flex justify-center" v-for="item in icons" :key="item.label">
                <v-btn icon dark :to="item.url" :title="item.title"><v-icon>{{ item.icon }}</v-icon></v-btn>
            </v-col>
        </v-row>
    </v-toolbar>
</template>
<script>
import { mapActions } from "vuex";
import defines from "../defines/define";
export default {
    name: "toolbar",
    data() {
        return {
            icons: [
                {label: "Mon profil", url: defines.PROFIL_URL, title: "Mon profil", icon: "mdi-account"},
                {label: "Mes notificaton", url: defines.NOTIFICATION_URL, title: "Mes notifications", icon: "mdi-bell-ring"},
                {label: "Voir l'équipe ", url: defines.TEAM_URL, title: "Voir l'équipe", icon: "mdi-account-group"},
                {label: "Se déconnecter", url: defines.LOGOUT_URL, title: "Se déconnecter", icon: "mdi-logout"},
            ],
        };
    },
    methods: {
        ...mapActions(["toggleDrawer"]),
    }
}
</script>

<style lang="scss" scoped>
</style>