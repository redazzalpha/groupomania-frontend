<template>
    <auth tab="team" :auth_url="auth_url"  @onReady="trigger">
        <slot v-if="showPage">
            <h2 class="pa-5">&Eacute;quipe</h2>
            <!--search-field-->
            <v-card max-width=550 class="mx-auto elevation-12" color="grey lighten-3">
                <v-container grid-list-xs>
                <v-row>
                    <v-col>
                        <v-text-field
                            outlined
                            label="Trouver un utilisateur "
                        >
                            <template v-slot:prepend-inner>
                                <v-avatar
                                    size="30"
                                    color="primary"
                                >
                                <v-icon color="white">mdi-account</v-icon>
                                </v-avatar>
                            </template>
                        </v-text-field>
                    </v-col>
                </v-row>                
                </v-container>
            </v-card>
            <!--user-item-block-->
            <v-container grid-list-xs>
                <v-row>
                    <v-col class="d-sm-flex ">
                        <!--dialog-->
                        <v-dialog
                        v-for="item in users" :key="item.userId"
                        transition="dialog-top-transition"
                        max-width="600"
                        >
                            <!--dialog-activator-->
                            <template v-slot:activator="{ on, attrs }">
                                <!--user-item-->
                                <v-container grid-list-xs v-on="on" v-bind="attrs">
                                    <v-row class="d-flex justify-center">
                                        <v-col>
                                            <!--user-item-->
                                            <userItem
                                            :hover="hover"
                                            :item="item"
                                            ></userItem>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </template>
                            <!--dialog-expanded-->
                            <template v-slot:default="dialog">
                                <!--user-profil-card-->
                                <userProf
                                :dialog="dialog"
                                :item="item"
                                ></userProf>
                            </template>        
                        </v-dialog>                        
                    </v-col>
                </v-row>
            </v-container>
        </slot>
    </auth>
</template>

<script>
import defines from "../defines/define";
import auth from "../components/auth.vue";
import userItem from "../components/userItem.vue";
import userProf from "../components/userProf.vue";
export default {
    name: "team",
    components: {
        auth,
        userItem,
        userProf,
    },
    data() {
        return {
            auth_url: `${defines.SERVER_URL}${defines.TEAM_URL}`, 
            showPage: false,
            users: [],
            input: "",
            hover: "",
        };
    },
    computed: {
    },
    methods: {
        getUsers() {
            this.$http.get(`${defines.SERVER_URL}${defines.USERS_URL}`)
            .then(
                success => {
                    this.users = success.body.results;
                },
                (/*failed*/) => {

                }
            );
        },
        refresh() {
            this.getUsers();
        },
        // function used for show or unshow home view
        trigger(ready) {
            this.showPage = ready;                                                                                                                         
        },
    },
    created() {
        this.refresh();
    }
}
</script>

