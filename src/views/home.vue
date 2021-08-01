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
                :key="item.id" 
                :userImgName="userImg"
                :authorImgName="item.img"
                :authorName="item.pseudo"
                :authorPub="item.text" 
                :likeCount="item.postLike"
                :dislikeCount="item.postDislike"
            ></pubcard>
            <!--error-dial-->
            <errordial
            title="Erreur système"
            :text="dialogErrText"
            :model= "dialogErr"
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

                // check local storage
                if(localStorage.grpm_store != null && localStorage.grpm_store != undefined) {


                    // get data from localstorage
                    const grpm_store =  JSON.parse(localStorage.grpm_store);

                    // create payload
                    let payload = {
                        url: `${process.env.VUE_APP_SERVER_URL}${defines.PUBLISH_URL}`,
                        data: {
                            token: grpm_store.data.token,
                            tokenRefresh: grpm_store.data.tokenRefresh,
                            publication: this.pubTextArea,
                        },
                    };

                    // create headers
                    const head = {
                        "Accept": "application/json",
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${payload.data.token}`,
                    };

                    // post request
                    this.$http.post(payload.url, payload.data, { headers: head })
                    .then(
                        (/*success*/) => {
                            this.pubTextArea = "";
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
                // if localstorage data is empty or undefined
                else {
                    this.dialogErrText = "Une erreur s'est produite reconnectez-vous et réessayez"
                    this.dialogErr = true;
                }
            }
            // if publication is empty set error dialog
            else {
                this.dialogErrText = "Vous ne pouvez pas créer de publication vide"
                this.dialogErr = true;
            }  
        },
        getPubs() {
        // get publications
        if(localStorage.grpm_store != null && localStorage.grpm_store != undefined) {
                const grpm_store = JSON.parse(localStorage.grpm_store);

                // create payload
                const payload = {
                    url: `${process.env.VUE_APP_SERVER_URL}${defines.PUBLISH_URL}`,
                    data: {
                        token: grpm_store.data.token,
                    }
                };

                // create headers
                const head = {
                    "Accept": "application/json",
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${payload.data.token}`,
                };
        
                // post request
                this.$http.get(payload.url,  { headers: head })
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
            }
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
        this.getPubs();
    },
}
</script>
