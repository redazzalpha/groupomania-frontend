<template>
    <auth :authUrl="authUrl"  @onReady="trigger">
        <slot v-if="showPage">
            <h1 class="pa-5">&Eacute;quipe</h1>
            <!--search-field-->
            <v-card max-width=550 class="mx-auto elevation-12" color="grey lighten-3">
                <v-container grid-list-xs>
                <v-row>
                    <v-col>
                        <v-text-field
                            autofocus
                            outlined
                            label="Trouver un utilisateur"
                            tag="textarea"
                            v-model="fieldValue"
                            @input="findUser"
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
                <v-row class="d-flex flex-wrap">
                    <!-- to change the view of the user profile item
                    set flex to flex-column or flex-wrap
                    -->
                    <v-col class="d-flex flex-column justify-center px-0">
                        <!--dialog-->
                        <v-dialog
                        v-for="item in userList" :key="item.userId"
                        transition="dialog-top-transition"
                        max-width="900px"
                        :fullscreen="$vuetify.breakpoint.mobile"
                        >
                            <!--dialog-activator-->
                            <template v-slot:activator="{ on, attrs }">
                                <v-col v-on="on" v-bind="attrs"  class="px-2 col-sm-6 mx-auto">
                                    <!--user-Item-->
                                    <userItem
                                    :hover="hover"
                                    :item="item"
                                    tag="button"
                                    ></userItem>
                                </v-col>
                            </template>
                            <!--dialog-expanded-->
                            <template v-slot:default="dialog">
                                <!--user-profil-card-->
                                <userProf
                                :dialog="dialog"
                                :item="item"
                                @refresh="refresh"
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
import { mapActions, mapState } from 'vuex';
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
            authUrl: `${defines.SERVER_URL}${defines.TEAM_URL}`, 
            showPage: false,
            userList: [],
            input: "",
            hover: "",
            fieldValue: "",
            fab: false,
        };
    },
    computed: {
        ...mapState([
            "users",
        ])
    },
    methods: {
        ...mapActions([
            "setProgress",
            "pubScroll",
            "getUsers"
        ]),
        gusers() {
            this.getUsers()
            .then( () => this.userList = this.users )
            .catch();
        },
        findUser() {
            if(this.fieldValue != "") {
                let regex = new RegExp(this.fieldValue, "gi");
                this.userList = this.users.filter(item => {
                    return regex.test(item.pseudo);
                });
            }
            else this.userList = this.users;
        },                         
        refresh() {
            this.gusers();
        },
        // function used for show or unshow view
        trigger(ready) {
            this.showPage = ready;                                                                                                                         
        },
    },
    created() {
        this.refresh();
    },
}
</script>

