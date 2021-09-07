<template>
    <auth tag="team" :authUrl="authUrl"  @onReady="trigger">
        <slot v-if="showPage">
            <h1 :class="'pa-5 ' + (darkMode?'white':'black') + '--text'">&Eacute;quipe</h1>
            <!--bbutton-style-view-->
            <div>
                <v-btn 
                text
                plain
                tag='button'
                title='Vue en line'
                :color="darkMode? '': 'black'" 
                :dark='darkMode'
                @click="viewLine"
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
                @click="viewBlock"
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
                    <!-- to change the view of the user profile item
                    set flex to flex-column or flex-wrap
                    -->
                    <v-col class="d-flex flex-column justify-center px-0 items">
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
            "darkMode"
        ])
    },
    methods: {
        ...mapActions([
            "userData",
            "setProgress",
            "pubScroll",
            "getUsers",
            "setDarkMode",
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
        viewLine() {
            const col = document.querySelector('.items');
            col.classList.remove('flex-wrap')
            col.classList.add('flex-column')
        },
        viewBlock() {
            const col = document.querySelector('.items');
            col.classList.remove('flex-column')
            col.classList.add('flex-wrap')
        },
    },
    created() {
        this.refresh();
    },
}
</script>

