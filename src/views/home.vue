<template>
    <auth tab="home" :auth_url="auth_url"  @onReady="trigger">
        <slot v-if="showPage">
            <h2 class="pa-5">Dernières publiations</h2>
            <!--express your-self-card-->
            <v-card elevation="15" color="grey lighten-3" max-width=550 class="ma-auto mb-8">
                <v-container>
                    <v-row>
                        <v-col>
                            <v-card-title>Exprimez-vous...</v-card-title>
                            <v-card-subtitle class="d-none d-sm-block">Publiez ce que vous aimez !</v-card-subtitle>
                        </v-col>
                        <v-col class="d-flex flex-row-reverse">
                            <v-avatar size=60>
                                <v-img v-if="userData.img" :src="userImg"  />
                                <v-icon v-else size=60 color="primary">mdi-account-circle</v-icon>
                            </v-avatar>

                        </v-col>
                    </v-row>
                </v-container>
                <v-card-text>
                    <v-textarea 
                    v-model="pubTextArea" 
                    background-color="white" 
                    placeholder="Ajouter un texte"
                    outlined 
                    clearable
                    no-resize
                    auto-grow
                    ></v-textarea>
                </v-card-text>
                <v-card-actions>
                    <v-container>
                        <v-row no-gutters class="d-flex justify-space-between">
                            <v-col v-for="item in buttons" :key="item.label" :class="item.class">
                                <v-btn small @click="item.action">{{ item.label }}</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-actions>
            </v-card>
            <!--publication-card-->
            <pubcard
                v-for="item in publications"
                :key="item.pubId" 
                :userImgName="userImg"
                :authorImgName="item.img"
                :authorName="item.pseudo"
                :authorPub="item.text" 
                :likeCount="item.postLike"
                :dislikeCount="item.postDislike"
                :pubId="item.pubId"
                :comments="comments"
                @comment="postComment"
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
import btnClose from "../components/btnClose.vue";
import pubcard from "../components/pubcard.vue";
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
            auth_url: `${process.env.VUE_APP_SERVER_URL}${defines.HOME_URL}`, 
            userData: null,
            showPage: false,
            pubTextArea: "",
            dialogErr: false,
            dialogErrText: "",
            publications: [],
            comments: [],
            buttons: [
                {label: "Ajouter une image", class: "col-8",action: this.insertImg},
                {label: "Publiez !", class: "d-flex justify-end col-4", action: this.publish },
            ]
        };
    },
    computed: {
        userImg() {
            if(this.userData.img) {
                let images = require.context('../assets', false, /\.png$|\.jpg$|\.jpeg$/)
                return images(`./${this.userData.img}`);
            }
            return null;
        },
    },
    methods: {
        publish() {
            //post publication
            // check if publication if empty   
            if(this.pubTextArea && services.checkPublication(this.pubTextArea)) {

                // create payload
                let payload = {
                    url: `${process.env.VUE_APP_SERVER_URL}${defines.PUBLISH_URL}`,
                    data: { publication: this.pubTextArea }
                };

                // post request
                this.$http.post(payload.url, payload.data)
                .then(
                    (/*success*/) => {
                        this.pubTextArea = "";
                        this.updatePost();
                    },
                    failed => {
                        failed.json()
                        .then(json => {
                            switch(json.error.code) {
                                default:
                                    throw new Error("Unknown error");    
                            }
                        })
                    }
                );
            }
            // if publication is empty set error dialog
            else {
                this.dialogErrText = "Vous ne pouvez pas créer de publication vide"
                this.dialogErr = true;
            }  
        },
        postComment(comData) {
            const payload = {
                url: `${process.env.VUE_APP_SERVER_URL}${defines.COMMENT_URL}`,
                data: {
                    pubId: comData.pubId,
                    text: comData.comText,
                }
            };
            this.$http.post(payload.url, payload.data)
            .then(
                (/*success*/) => {this.updatePost();},
                (/*failed*/) => {}
            );
        },
        getPubs() {
            // get request
            this.$http.get(`${process.env.VUE_APP_SERVER_URL}${defines.PUBLISH_URL}`)
            .then(
                (success) => {
                    success.json()
                    .then(json => {
                        if(json.results.length >= 1)
                            this.publications = json.results;
                    });
                },
                (/*failed*/) => {}
            );
        },
        getComs() {
            // get request
            this.$http.get(`${process.env.VUE_APP_SERVER_URL}${defines.COMMENT_URL}`)
            .then(
                (success) => {
                    success.json()
                    .then(json => {
                        if(json.results.length >= 1)
                            this.comments = json.results;
                    });
                },
                (/*failed*/) => {}
            );
        },
        updatePost() {
            this.getPubs();
            this.getComs();
        },
        insertImg() {

        },
        // function used for show or unshow home view
        trigger(payload) {
            if(payload.ready) {
                this.showPage = payload.ready;                                                                                                                         
                this.userData = payload.json;
            }
        },
        // function used to close error dialog
        close() {
            this.dialogErr = !this.dialogErr;
        },
    },
    mounted() {
        this.updatePost();
    },
}
</script>
