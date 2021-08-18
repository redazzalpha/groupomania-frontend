<template>
    <auth tab="home" :auth_url="auth_url"  @onReady="trigger">
        <slot v-if="showPage">
            <h2 class="pa-5">Dernières publiations</h2>
            <!--express your-self-card-->
            <v-card elevation="15" color="grey lighten-3" max-width=550 class="mx-auto mb-8" style="position: relative; border: solid red 3px;">
                <v-container>
                    <v-row>
                        <v-col>
                            <v-card-title>Exprimez-vous...</v-card-title>
                            <v-card-subtitle class="d-none d-sm-block">Publiez ce que vous aimez !</v-card-subtitle>
                        </v-col>
                        <v-col class="d-flex flex-row-reverse">
                            <v-btn to="/app/profil" title="Accéder au profil" icon>
                                <v-avatar size=60>
                                    <v-img v-if="userData.img" :src="userData.img"  />
                                    <v-icon v-else size=60 color="primary">mdi-account-circle</v-icon>
                                </v-avatar>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
                <v-card-text>
                    <ckeditor  class="area" :editor="editor" v-model="editorData" :config="editorConfig"> </ckeditor> 
                </v-card-text>
                <v-card-actions>
                    <v-container>
                        <v-row no-gutters class="d-flex justify-space-between">
                            <v-col v-for="item in buttons" :key="item.label" :class="item.class">
                                <v-btn 
                                small 
                                :loading="gloading(item)"
                                :disabled="false"
                                @click="item.action" 
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
            <pubcard
                :userPseudo="userData.pseudo"
                :userImg="userData.img"
                @comment="comment"
                @delPub="delPub"
                @delCom="delCom"
                @like="like"
                @dislike="dislike"
                @unlike="unlike"
                @undislike="undislike"
                @refresh="refresh"
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
import services from "../services/home.service";
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
                    'blockQuote', 
                    'mediaEmbed', 
                    'undo', 
                    'redo',
                ],
            },

            auth_url: `${defines.SERVER_URL}${defines.HOME_URL}`, 
            showPage: false,
            dialogErr: false,
            dialogErrText: "",
            loading: false,
            loading2: false,
            loader: null,
            loader2: null,
            buttons: [
                {label: "Ajouter une image", class: "col-8",action: this.onPickFile},
                {label: "Publiez !", class: "d-flex justify-end col-4", action: this.publish},
            ],
            gloading(item) {
                if(/^Publiez !$/gi.test(item.label))
                return this.loading2;
                else return this.loading;
            }
        };
    },
    computed: {
        ...mapState(["userData"]),
    },
    methods: {
        ...mapActions(["setPublications", "setComments", "setNotifs"]),
        publish() {
            if(this.editorData && services.isNotEmpty(this.editorData)) {
                const pub = this.editorData.replace("'", "\\'").replace("\\", "/");
                this.$http.post(`${defines.SERVER_URL}${defines.PUBLISH_URL}`, {publication: pub})
                .then( () => {
                    this.refresh();
                    this.editorData = '';
                });
            }
            else {
                this.dialogErrText = "Vous ne pouvez pas créer de publication vide"
                this.dialogErr = true;
            }  
        },
        getPubs() {
            return new Promise((resolve, reject) => {
                // get request
                this.$http.get(`${defines.SERVER_URL}${defines.PUBLISH_URL}`)
                .then(
                    (success) => {
                        this.setPublications(success.body.results);
                        resolve();
                    },
                    (failed) => {
                        reject(failed);
                    }
                );
            });
        },
        delPub(pubId) {
            const payload = { pubId };
            this.$http.post(`${defines.SERVER_URL}${defines.PUBLISH_DEL_URL}`, payload)
            .then(
                (/*success*/) => { 
                    this.refresh();
                },
                (/*failed*/) => {
                }
            );
        },
        comment(data) {
            // check if publication if empty   
            if(data.comText && services.isNotEmpty(data.comText)) {
                // create payload
                const payload = {
                    parentId: data.parentId,
                    comText: data.comText,
                    authorId: data.authorId,
                };
                // post request
                this.$http.post(`${defines.SERVER_URL}${defines.COMMENT_URL}`, payload)
                .then(
                    (/*success*/) => { 
                        this.refresh(); 
                    },
                    (/*failed*/) => {}
                );
            }
            // if comment is empty set error dialog
            else {
                this.dialogErrText = "Vous ne pouvez pas créer de commentaire vide"
                this.dialogErr = true;
            }  
        },
        getComs() {
            return new Promise((resolve, reject) => {
                // get request
                this.$http.get(`${defines.SERVER_URL}${defines.COMMENT_URL}`)
                .then(
                    (success) => {
                        this.setComments(success.body.results);
                        resolve();
                    },
                    (failed) => {reject(failed);}
                );
            });
        },
        delCom(data) {
            const payload = { 
                comId: data.comId,
                pubId: data.pubId,
            };
            this.$http.post(`${defines.SERVER_URL}${defines.COMMENT_DEL_URL}`, payload)
            .then(
                (/*success*/) => { this.refresh(); },
                (/*failed*/) => {
                }
            );
        },
        getNotifs() {
            return new Promise((resolve, reject) => {
                this.$http.get(`${defines.SERVER_URL}${defines.NOTIFICATION_URL}`)
                .then(
                    (success) => {
                        const notifs = success.body.results.filter(item => item.whereId == this.userData.userId);
                        this.setNotifs(notifs);
                        resolve();
                    },
                    (failed) => { reject(failed); }
                );
            });
        },
        like(data){
            if(data.userIdLike)             
                data.userIdLike.push(this.userData.userId)
            else data.userIdLike = [this.userData.userId];
            const payload = { data };  
            this.$http.post(`${defines.SERVER_URL}${defines.PUBLISH_LIKE_URL}`, payload)
            .then(
                (/*success*/) => { this.refresh(); },
                (/*failed*/) => {},
            );
        },
        dislike(data) {
            if(data.userIdDislike)
                data.userIdDislike.push(this.userData.userId)
            else data.userIdDislike = [this.userData.userId];
            const payload = { data };            
            this.$http.post(`${defines.SERVER_URL}${defines.PUBLISH_DISLIKE_URL}`, payload)
            .then(
                (/*success*/) => { this.refresh(); },
                (/*failed*/) => {},
            );
        },
        unlike(data) {
            data.userIdLike = data.userIdLike.filter(item => {return item != this.userData.userId;} );
            const payload = { data };  
            this.$http.post(`${defines.SERVER_URL}${defines.PUBLISH_UNLIKE_URL}`, payload)
            .then(
                (/*success*/) => { this.refresh(); },
                (/*failed*/) => {},
            );
        },
        undislike(data) {
            data.userIdDislike = data.userIdDislike.filter(item => {return item != this.userData.userId;} );
            const payload = { data };            
            this.$http.post(`${defines.SERVER_URL}${defines.PUBLISH_UNDISLIKE_URL}`, payload)
            .then(
                (/*success*/) => { this.refresh(); },
                (/*failed*/) => {},
            );
        },
        refresh() {
            this.getPubs()
                .then( () => {
                    this.getComs()
                        .then( () => {
                            this.getNotifs()
                        })
                        .catch();
                })
                .catch();
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
            this.dialogErr = !this.dialogErr;
        },
    },
    created() {
        this.refresh();
    },
}
</script>

