<template>
    <v-footer 
    padless
    color='transparent' 
    :dark='darkMode'
    class=" mt-5"
     >
        <v-row justify="center" no-gutters>                                                                                     
            <v-btn 
            v-for="item in icons" 
            text plain
            tag="button"
            :key="item.link" 
            :href="item.link" 
            >
                <v-icon>{{ item.icon }}</v-icon>
            </v-btn>
            <v-col class=" py-4 text-center" cols="12" >
                {{ new Date().getFullYear() }} — <strong>Redazzalpha&copy;</strong>
            </v-col>
        </v-row>
    </v-footer>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'ftr',
    data() {
        return {
            icons: [ 
                {icon: 'mdi-facebook', link: 'https://www.facebook.com/'},
                {icon: 'mdi-twitter', link: 'https://www.twitter.com/'},
                {icon: 'mdi-linkedin', link: 'https://www.linkedin.com/'},
                {icon: 'mdi-instagram', link: 'https://www.instagram.com/'},
            ],
        };
    },
    computed: {
        ...mapState([
            "darkMode",
        ])
    }
}
</script>

