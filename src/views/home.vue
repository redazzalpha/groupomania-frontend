<template>
    <auth tab="home" :auth_url="auth_url"  @onReady="trigger">
        <slot v-if="showPage">
            <h2 class="pa-5">Dernières publiations</h2>
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
                                <v-avatar size=60>
                                    <v-img v-if="userData.img" :src="userData.img"  />
                                    <v-icon v-else size=60 color="primary">mdi-account-circle</v-icon>
                                </v-avatar>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
                <v-card-text>
                    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"> </ckeditor> 
                </v-card-text>
                <v-card-actions>
                    <v-container>
                        <v-row no-gutters class="d-flex  justify-space-between">
                            <v-col v-for="item in buttons" :key="item.label" :class="item.class">
                                <v-btn 
                                small 
                                :loading="gloading(item)"
                                :disabled="false"
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
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import '@ckeditor/ckeditor5-build-classic/build/translations/fr';


export default {
    name: "home",
    components: {
        auth,
        errordial,
        btnClose,
        pubcard,
    },
    data(){
        return {
            editor: ClassicEditor,
            editorData: '',
            editorConfig: {
                height: "500",
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

            auth_url: `${defines.SERVER_URL}${defines.HOME_URL}`, 
            showPage: false,
            loading: false,
            loading2: false,
            loader: null,
            loader2: null,
            buttons: [
                {label: "Ajouter une image", class: "flex-grow-0",action: this.onPickFile},
                {label: "Publiez !", class: "d-flex justify-end col-4", action: this.postPub},
            ],
            gloading(item) {
                if(/^Publiez !$/gi.test(item.label))
                return this.loading2;
                else return this.loading;
            }
        };
    },
    computed: {
        ...mapState([
            "userData",
            "publications",
            "dialogErrText",
            "dialogErr"
        ]),
    },
    methods: {
        ...mapActions([
            "publish",
            "refresh",
            "setDialErr",
        ]),
        postPub(editorData) {
            this.publish(editorData);
            this.editorData = "";
        },
        onPickFile () { 
            this.loading = true;
            this.$refs.fileInput.click();

            setTimeout(() => {this.loading = false;}, defines.TIMEOUT)
        },
        putImg (e) { 

            const file = e.target.files[0];
            const freader = new FileReader();
            if(file)
                freader.readAsDataURL(file);
            freader.onload = () => {
                let img = document.createElement('img');
                img.src = freader.result;
                img.width = "100%";
                this.editorData += img.outerHTML;
            };            
        },
        // function used for show or unshow home view
        trigger(ready) {
            this.showPage = ready;
        },
        // function used to close error dialog
        close() {
            this.setDialErr(false)
        },
    },
    created() {
        this.refresh();
    },
}
</script>

<style lang="scss">
.ck.ck-editor__main>.ck-editor__editable {
    min-height: 150px;
}
</style>