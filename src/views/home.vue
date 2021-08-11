<template>
    <auth tab="home" :auth_url="auth_url"  @onReady="trigger">
        <slot v-if="showPage">
            <h2 class="pa-5">Dernières publiations</h2>
            <!--express your-self-card-->
            <v-card elevation="15" color="grey lighten-3" max-width=550 class="ma-auto mb-8" style="position: relative">
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

                <v-textarea 
                v-model="pubTextArea" 
                background-color="white" 
                placeholder="Ajouter un texte"
                outlined 
                no-resize
                auto-grow
                >
                </v-textarea>

                <!--
                <div id="textarea"
                contentEditable="true" 
                style="border: solid grey 1px;
                min-height: 200px; 
                background-color: white;
                padding: 10px;
                outline: none;
                border-radius: 10px;
                color: black;
                caret-color: red;
                "    
                >
                </div>
                -->

                </v-card-text>
                <v-card-actions>
                    <v-container>
                        <v-row no-gutters class="d-flex justify-space-between">
                            <v-col v-for="item in buttons" :key="item.label" :class="item.class">
                                <v-btn small @click="item.action">{{ item.label }}</v-btn>
                            </v-col>
                            <input v-show="0" type="file" accept="image/*" ref="fileInput" @change="putImg" />
                        </v-row>
                    </v-container>
                </v-card-actions>
            </v-card>
            <!--publication-card-->
            <pubcard
                :userId="userData.userId"
                :userPseudo="userData.pseudo"
                :userImg="userData.img"
                :publications="publications"
                :comments="comments"
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
import services from "../services/home.service";
import defines from "../defines/define";
import auth from "../components/auth.vue";
import errordial from "../components/errordial.vue";
import pubcard from "../components/pubcard.vue";
import btnClose from "../components/btnClose.vue";
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
            auth_url: `${defines.SERVER_URL}${defines.HOME_URL}`, 
            userData: null,
            showPage: false,
            pubTextArea: "",
            dialogErr: false,
            dialogErrText: "",
            publications: [],
            comments: [],
            buttons: [
                {label: "Ajouter une image", class: "col-8",action: this.onPickFile},
                {label: "Publiez !", class: "d-flex justify-end col-4", action: this.publish },
            ],
        };
    },
    methods: {
        publish() {
            //let textarea = document.getElementById("textarea");
            //alert(textarea.innerHTML.split(/<img.+\/>/gi));
            //alert(textarea.innerHTML.match(/<img.*<\/img>/gi));

            //post publication
            // check if publication if empty   
            if(this.pubTextArea && services.isNotEmpty(this.pubTextArea)) {
                // create payload
                const payload = { publication: this.pubTextArea };
                // post request
                this.$http.post(`${defines.SERVER_URL}${defines.PUBLISH_URL}`, payload)
                .then(
                    (/*success*/) => {
                        this.pubTextArea = "";
                        this.refresh();
                    },
                    (failed) => {
                        switch(failed.body.error.code) {
                            default:
                                throw new Error("Unknown error");    
                        }
                    }
                );
            }
            // if publication is empty set error dialog
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
                        this.publications = success.body.results;
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
                    pubId: data.pubId,
                    comment: data.comText,
                };
                // post request
                this.$http.post(`${defines.SERVER_URL}${defines.COMMENT_URL}`, payload)
                .then(
                    (/*success*/) => { this.refresh(); },
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
                        this.comments = success.body.results;
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
                .then( () => this.getComs() )
                .catch();
        },
        putImg (event) { 

            let textarea = document.getElementById("textarea");                                                   
            let img = document.createElement("img");

            let file = event.target.files[0];
            let fileReader = new FileReader();

            if(file) {
                fileReader.readAsDataURL(file);
                this.img = file;
            }
            fileReader.addEventListener('load', function (){ 
                img.setAttribute("src", fileReader.result);
                img.setAttribute("width", "100%");
                textarea.appendChild(img);
                textarea.focus();   
            }, false);

            //let payload = new FormData();
            //payload.append("image", file, file.name);

            //this.$http.post(`${defines.SERVER_URL}${defines.PROFIL_IMG_URL}`, payload)
            //.then(
                //(/*success*/) => {
                //},
                //(/*failed*/) => {
                //}
            //);
        },
        onPickFile () { 
            this.$refs.fileInput.click();
        },
        // function used for show or unshow home view
        trigger(payload) {
            if(payload.ready) {
                this.showPage = payload.ready;                                                                                                                         
                this.userData = payload.userData;
            }
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

