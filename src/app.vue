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
import hdr from "./components/header.vue";
export default {
    components: {
        hdr,
    },
}
</script>

<style lang="scss" scoped>
</style>