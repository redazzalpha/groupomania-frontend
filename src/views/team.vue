<template>
    <auth tag="team" :authUrl="authUrl"  @onReady="trigger">
        <slot v-if="showPage">
            <h1 :class="'pa-5 ' + (darkMode?'white':'black') + '--text'">&Eacute;quipe</h1>
            <!--button-style-view-->
            <div>
                <v-btn 
                text
                plain
                tag='button'
                title='Vue en colonne'
                :color="darkMode? '': 'black'" 
                :dark='darkMode'
                @click="viewColumn=true"
                >
                    <v-icon>mdi-filter-variant</v-icon>
                </v-btn>
                <v-btn 
                text
                plain
                tag='button'
                title='Vue en bloc'
                :color="darkMode? '': 'black'" 
                :dark='darkMode'
                @click="viewColumn=false"
                >
                    <v-icon>mdi-border-all</v-icon>
                </v-btn>
            </div>
            <!--search-field-->
            <v-card 
            max-width=550
            :color="darkMode? '': 'grey lighten-3'" 
            :dark='darkMode'
            class="mx-auto elevation-12"
            >
                <v-container grid-list-xs>
                <v-row>
                    <v-col>
                        <v-text-field
                        ref='field'
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
                                :color="darkMode? 'grey': 'primary'" 
                                :dark='darkMode'
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
                    <v-col :class="'d-flex justify-center px-0 ' + (viewColumn?'flex-column':'flex-row flex-wrap')">
                        <!--profil-dialog-->
                        <v-dialog
                        v-for="item in userList" :key="item.userId"
                        :fullscreen="$vuetify.breakpoint.mobile"
                        transition="dialog-top-transition"
                        max-width="900px"
                        >
                            <!--dialog-activator-->
                            <template v-slot:activator="{ on, attrs }">
                                <v-col v-on="on" v-bind="attrs"  :class="'mx-auto ' + (!viewColumn?'col-6':'')">
                                    <!--user-Item-->
                                    <userItem
                                    tag="button"
                                    :item="item"
                                    :viewColumn='viewColumn'
                                    ></userItem>
                                </v-col>
                            </template>
                            <!--dialog-expanded-->
                            <template v-slot:default="dialog">
                                <!--user-profil-card-->
                                <userProf
                                :dialog="dialog"
                                :item="item"
                                @refresh="gusers"
                                v-observe-visibility="observer"
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
            userList: [],
            input: "",
            fieldValue: "",
            viewColumn: true,
            showPage: false,
            fab: false,
        };
    },
    computed: {
        ...mapState([
            "users",
            "darkMode"
        ]),
    },
    methods: {
        ...mapActions([
            "userData",
            "pubScroll",
            "getUsers",
            "setDarkMode",
        ]),
        gusers() {
            this.getUsers()
            .then( () => this.userList = this.users );
        },
        findUser() {
            if(this.fieldValue != "") {
                let regex = new RegExp(this.fieldValue, "gi");
                this.userList = this.users.filter(item => {
                    return item.pseudo.match(regex);
                });
            }
            else this.userList = this.users;
        }, 
        observer(isVisible) {
            if(isVisible) {
                this.fieldValue = "";
                this.gusers();
            }
        },                     
        // function used for show or unshow view
        trigger(ready) {
            this.showPage = ready;                                                                                                                         
        },
    },
    created() {
        this.gusers();
    },
}
</script>

