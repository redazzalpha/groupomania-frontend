<template>
    <auth tab="notification" :authUrl="authUrl"  @onReady="trigger">
        <slot v-if="showPage">
            <h2 class="pa-5">Notifications</h2>
            <div v-if="getEmpty" class="text-center title">Vous n'avez pas de notifications !</div>
            <!--notification-item-->
            <v-hover v-for="item in notifs" :key="item.comId" style="overflow: hidden">
                    <template v-slot:default="{ hover }">
                        <v-card shaped color="grey lighten-2" max-width=550 class="mx-auto mb-5 transition-swing" :elevation="hover ? 11 : 4">                            
                            <v-container class="pb-0" >
                                <!--header-notif-->
                                <v-row no-gutters>
                                    <v-col class="flex-grow-0">
                                        <v-avatar size=60>
                                            <v-img v-if="item.img" :src="item.img"  />
                                            <v-icon v-else size=60 color="primary">mdi-account-circle</v-icon>
                                        </v-avatar>
                                    </v-col>
                                    <v-col>
                                        <v-container class="py-2">
                                            <v-row no-gutters>
                                                <v-col>
                                                    <v-card-text class="pa-0">{{ item.pseudo}} a commenté votre publication.</v-card-text>
                                                </v-col>
                                            </v-row>
                                            <v-row no-gutters>
                                                <v-col>
                                                    <v-card-text class="pa-0 font-italic">le {{ item.comTime.substring(0,20) }}</v-card-text>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-col>
                                    <v-col class="d-flex flex-grow-0 align-center">
                                        <v-btn
                                        icon 
                                        color="grey lighten-1"
                                        title="Supprimer la notification"
                                        class="pr-3"
                                        :loading="loading"
                                        :disabled="loading"
                                        @click="postDelNotif(item.notifId)"
                                        >
                                            <v-icon>mdi-close-circle</v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <!--expanded-notif-->
                            <v-expansion-panels>
                                <v-expansion-panel>
                                    <v-expansion-panel-header class="py-0" color="grey lighten-2" @click="readNotif(item)">
                                        <v-icon color="primary">mdi-comment-processing</v-icon>
                                        <v-badge :dot="!hover" :value="item.state == 'unread'" content="Nouveau" color="warning" style="position: absolute; left: 50%; top: 20px;"></v-badge>
                                    </v-expansion-panel-header>
                                    <!--expanded-message-->
                                    <v-expansion-panel-content color="grey lighten-2">
                                        <v-container>
                                            <v-row>                                        
                                                <v-col class="body-2">
                                                        &#x27a1;&#xfe0f; Publication du <span class="font-italic">{{ item.time.substring(0,20) }}</span>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col>
                                                    <ckeditor :disabled="true" :editor="editor" :value="geditorData(item.text)" :config="editorConfig"> </ckeditor> 
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col>	
                                                    {{ item.pseudo }} a dit &#10148; <span class="font-italic">{{ item.comText }}</span>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-card>
                </template>
            </v-hover>


        </slot>
    </auth>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import auth from "../components/auth.vue";
import defines from "../defines/define";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
    name: "notification",
    components: {
        auth,
    },
    data() {
        return {
            editor: ClassicEditor,
            editorData: '',
            editorConfig: {
                toolbar: [],
            },
            geditorData(text) {
                return  this.editorData = text;
            },

            authUrl: `${defines.SERVER_URL}${defines.NOTIFICATION_URL}`, 
            showPage: false,
            hover: false,
            empty: false,
            loading: false,
        };
    },
    computed: {
        ...mapState([
            "userData",
            "publications",
            "notifs"
        ]),
        getEmpty() {
            return !this.notifs.length >= 1;
        }
    },
    methods: {
        ...mapActions([
            "readNotif",
            "delNotif",
            "refresh",
        ]),
        postDelNotif(notifId) {
            this.loading = true;
            this.delNotif(notifId);
            setTimeout(() => {this.loading = false; }, defines.TIMEOUT);
        },
        // function used for show or unshow home view
        trigger(ready) {
            this.showPage = ready;                                                                                                                         
        },
    },
    created() {
        this.refresh();
    },
}
</script>
