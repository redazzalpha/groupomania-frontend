<template>
    <!--header-->
    <v-app-bar tag="header" app color="primary" height=115>
        <!--navbar-->
        <navbar/>
        <!--header-container-->
        <v-container fluid>
            <!--header-logo-->
            <v-row no-gutters>
                <v-col>
                    <img class="header-logo" src="../assets/header_logo.svg" alt="header logo" width="70%" style="max-width: 300px;" />
                </v-col>
            </v-row>
            <!--toolbar-->
            <v-row no-gutters>
                <toolbar />
            </v-row>
        </v-container>
    </v-app-bar>
</template>

<script>
import navbar from "../components/navbar.vue";
import toolbar from '../components/toolbar.vue';
export default {
    name: "hdr",
    components: {
        navbar,
        toolbar,
    },
}
</script>

