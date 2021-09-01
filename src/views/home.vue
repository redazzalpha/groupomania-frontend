<template>
    <auth :authUrl="authUrl"  @onReady="trigger">
        <slot v-if="showPage">
            <h1 class="pa-5">Dernières publications</h1>
            <!--welcom-alert-->
            <v-alert
            class="text-center mx-auto"
            color="deep-purple accent-4"
            max-width="550px"
            outlined
            text
            dismissible
            :value="showWelcome"
            >Bonjour {{ userData.pseudo }} ! &#x1F44B;
            </v-alert>
            <!--express your-self-card-->
            <v-card elevation="15" color="grey lighten-3" max-width=550 class="mx-auto mb-8 text-center" >
                <v-container>
                    <v-row>
                        <v-col>
                            <v-card-title>Exprimez-vous...</v-card-title>
                            <v-card-text class="d-none d-sm-flex" text-xs-left>Publiez ce que vous aimez !</v-card-text>
                        </v-col>
                        <v-col class="d-flex flex-row-reverse flex-grow-0">
                            <v-btn to="/app/profil" title="Accéder au profil" icon class="ma-3">
                                <avatar :item="userData"></avatar>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
                <v-card-text>
                    <ckeditor tag="textarea" :editor="editor" v-model="editorData" :config="editorConfig"> </ckeditor> 
                </v-card-text>
                <v-card-actions>
                    <!--buttons-->
                    <v-container>
                        <v-row no-gutters class="d-flex  justify-space-between">
                            <v-col v-for="item in buttons" :key="item.label" :class="item.class">
                                <v-btn 
                                text
                                small 
                                tag="button"
                                :loading="loading"
                                :disabled="loading"
                                @click="item.action(editorData)" 
                                >
                                    {{ item.label }}
                                </v-btn>
                            </v-col>
                            <input v-show="0" type="file" accept="image/*" ref="fileInput" @change="putImg" />
                        </v-row>
                    </v-container>
                </v-card-actions>
            </v-card>
            <!--publication-card-->
            <div v-if="publications.length <= 0" class="title text-center">Il n'y a pas encore de publication soyez le premier à en créer une !</div>
            <pubcard
                v-for="item in publications"
                :key="item.pubId"
                :item="item"
            ></pubcard>
            <!--error-dial-->
            <errordial
            title="Erreur système"
            :model= "dialogErr"
            :text="dialogErrText"
            >
                <template v-slot:bottom>
                    <btnClose text="Ok" :eventAtClick="close"></btnClose>
                </template >
            </errordial>
            <!--scroll-top-button-->
            <v-btn
            v-scroll="onScroll"
            v-show="fab"
            fab
            dark
            fixed
            bottom
            right
            color="primary"
            tab="button"
            @click="toTop"
          >
            <v-icon>mdi-chevron-up</v-icon>
          </v-btn>
        </slot>
    </auth>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import auth from "../components/auth.vue";
import defines from "../defines/define";
import errordial from "../components/errordial.vue";
import pubcard from "../components/pubcard.vue";
import btnClose from "../components/btnClose.vue";
import avatar from "../components/avatar.vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import '@ckeditor/ckeditor5-build-classic/build/translations/fr';
export default {
    name: "home",
    components: {
        auth,
        errordial,
        btnClose,
        pubcard,
        avatar,
    },
    data(){
        return {
            editor: ClassicEditor,
            editorData: '',
            editorConfig: {
                language: 'fr',
                toolbar: [
                    'heading', '|', 
                    'bold', 
                    'italic', 
                    'link', 
                    'bulletedList', 
                    'numberedList', '|', 
                    'outdent', 
                    'indent', '|', 
                    'mediaEmbed', 
                    'blockQuote', 
                    'undo', 
                    'redo',
                ],
            },

            authUrl: `${defines.SERVER_URL}${defines.HOME_URL}`, 
            showPage: false,
            loading: false,
            loader: null,
            loader2: null,
            buttons: [
                {label: "Ajouter une image", class: "flex-grow-0",action: this.onPickFile},
                {label: "Publiez !", class: "d-flex justify-end col-4", action: this.postPub},
            ],
            fab: false,
        };
    },
    computed: {
        ...mapState([
            "userData",
            "publications",
            "dialogErrText",
            "dialogErr",
            "showWelcome"
        ]),
    },
    methods: {
        ...mapActions([
            "publish",
            "setDialErr",
            "refresh",
            "setShowWelcome",
            "pubScroll",
        ]),
        postPub(editorData) {
            this.loading = true
            this.publish(editorData)
            .then( () => {
                this.editorData = "";
                setTimeout(() => {
                    this.loading = false;
                }, defines.TIMEOUT);
            })
            .catch( () => {
                setTimeout(() => {
                    this.loading = false;
                }, defines.TIMEOUT);
            });
        },
        putImg (e) { 
            // put img function appends
            //img into ckeditor field
            this.loading = true;
            const file = e.target.files[0];
            const freader = new FileReader();
            if(file)
                freader.readAsDataURL(file);
            else {
                setTimeout(() => {
                    this.loading = false;
                }, defines.TIMEOUT);
            }
            freader.onload = () => {
                let img = document.createElement('img');
                img.src = freader.result;
                img.width = "100%";
                this.editorData += img.outerHTML;
                setTimeout(() => {
                    this.loading = false;
                }, defines.TIMEOUT);
            };
        },
        onPickFile () { 
            this.loading = true;
            this.$refs.fileInput.click();

            setTimeout(
                () => {
                    this.loading = false;
            }, defines.TIMEOUT);
        },
        // function used for show or unshow home view
        trigger(ready) {
            this.showPage = ready;
        },
        // function used to close error dialog
        close() {
            this.setDialErr(false)
        },
        onScroll (e) {
            if (typeof window === 'undefined') return;
            const top = window.pageYOffset ||   e.target.scrollTop || 0;
            this.fab = top > 20;
        },
        toTop () {
            this.$vuetify.goTo(0);
        },
    },
    created() {         
        this.refresh();
        this.pubScroll();
        setTimeout(() => {this.setShowWelcome(false)}, defines.TIMEOUT * 10)
    },
}
</script>

<style lang="scss">
.ck.ck-editor__main>.ck-editor__editable {
    min-height: 150px;
}
</style>