<template>
    <auth tag="notificattion" :authUrl="authUrl"  @onReady="trigger">
        <slot v-if="showPage">
            <h1 :class="'pa-5 ' + (darkMode?'white':'black') + '--text'">Notifications</h1>
            <div v-if="getEmpty" :class="'title text-center pa-5 ' + (darkMode?'white':'black') + '--text'">Vous n'avez pas de notifications !</div>
            <!--delete-read-all-button-->
            <div v-else class="pa-3 pt-0">
                <v-btn 
                small
                plain
                text
                tag="button"
                :color='darkMode?"":"black"'
                :dark='darkMode'
                class="text-decoration-underline"
                @click="readAllNotifs"
                >Marquer tout comme lu</v-btn>
                <v-btn 
                small
                plain
                text
                tag="button"
                :color='darkMode?"":"black"'
                :dark='darkMode'
                class="text-decoration-underline"
                @click="delAllNotifs"
                >Supprimer tout</v-btn>
            </div>
            <!--notification-item-->
            <v-hover v-for="item in notifs" :key="item.notifId" style="overflow: hidden">
                    <template v-slot:default="{ hover }">
                        <v-card 
                        shaped 
                        max-width=550 
                        :color="darkMode? '': 'grey lighten-2'" 
                        :dark='darkMode'
                        :elevation="hover ? 11 : 4"
                        class="mx-auto mb-5 transition-swing" 
                        >
                            <v-container class="pb-0" >
                                <!--header-notif-->
                                <v-row no-gutters>
                                    <v-col class="flex-grow-0">
                                        <avatar :item="item"></avatar>
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
                                                    <v-card-text class="pa-0 font-italic">le {{ item.comTime }}</v-card-text>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-col>
                                    <v-col class="d-flex flex-grow-0 align-center">
                                        <v-btn
                                        icon 
                                        :color="darkMode? '': 'grey lighten-1'" 
                                        :dark='darkMode'
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
                                    <v-expansion-panel-header 
                                    class="py-0" 
                                    :color="darkMode? '': 'grey lighten-2'" 
                                    :dark='darkMode'
                                    @click="readNotif(item)"
                                    >
                                        <v-icon :color="darkMode? '': 'primary'" :dark='darkMode'>mdi-comment-processing</v-icon>
                                        <v-badge :dot="!hover" :value="item.state == 'unread'" content="Nouveau" color="warning" style="position: absolute; left: 50%; top: 20px;"></v-badge>
                                    </v-expansion-panel-header>
                                    <!--expanded-message-->
                                    <v-expansion-panel-content :color="darkMode? '': 'grey lighten-2'" :dark='darkMode'>
                                        <v-container>
                                            <v-row>
                                                <v-col class="body-2">
                                                        &#x27a1;&#xfe0f; Publication du <span class="font-italic">{{ item.time }}</span>
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
import avatar from '../components/avatar.vue';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
    name: "notification",
    components: {
        auth,
        avatar,
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
            "notifs",
            "darkMode"
        ]),
        getEmpty() {
            return !this.notifs.length >= 1;
        }
    },
    methods: {
        ...mapActions([
            "readNotif",
            "delNotif",
            "readAll",
            "deleteAll",
            "refresh",
        ]),
        postDelNotif(notifId) {
            this.loading = true;
            this.delNotif(notifId);
            setTimeout(() => {this.loading = false; }, defines.TIMEOUT);
        },
        readAllNotifs() {
            this.readAll();
        },
        delAllNotifs() {
            this.deleteAll();
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
