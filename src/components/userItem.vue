<template>
    <v-hover v-slot="{ hover }">
        <v-card 
        max-width=550 
        :color="darkMode? '': 'grey lighten-3'" 
        :dark='darkMode'
        :elevation="hover ? 11 : 4" :ripple="false"
        class="user-item mx-auto  pa-5 transition-swing" 
        >
            <v-container grid-list-xs class="pa-0">
                <v-row class="d-flex flex-column align-center justify-center text-center">
                    <v-col>
                        <avatar :item="item" :size=60></avatar>
                    </v-col>
                    <v-col class="d-flex align-center justify-center">
                        {{ item.pseudo }}
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-hover>
</template>

<script>
import { mapState } from 'vuex';
import avatar from '../components/avatar.vue';
export default {
    name: "usercard",
    components: {
        avatar,
    },
    props: {
        hover: Boolean,
        item: Object,
    },
    computed: {
        ...mapState([
            "darkMode",
        ]),
    }
}
</script>
<style lang="scss" scoped>
.user-item:hover{
    cursor: pointer;
}
</style>

