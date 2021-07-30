<template>
    <auth tab="home" :auth_url="auth_url"  @onReady="trigger">
        <slot v-if="ready">
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
                            <v-avatar color="primary"  right size="60" class="white--text"><v-img src="../assets/user_wolf.jpg" alt="user image" /></v-avatar>
                        </v-col>
                    </v-row>
                </v-container>
                <v-card-text>
                    <v-textarea 
                    v-model="publication" 
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
                :authorPub="pub" 
                authorName="MalcomZ"
                authorImgUrl="../assets/malcomZ.jpg"
                userImgUrl="../assets/user_wolf.jpg"
                likeCount=0
                dislikeCount=0
            ></pubcard>
            <!--error-dial-->
            <errordial
            title="Erreur système"
            :text="textDial"
            :model= "errordial"
            >
                <template v-slot:bottom>
                    <btnClose text="Ok" :eventAtClick="close"></btnClose>
                </template >

            </errordial>
        </slot>
    </auth>
</template>

<script>
import { mapActions, mapState } from "vuex";
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
            ready: true,
            publication: "",
            errordial: false,
            titleDial: "",
            textDial: "",
            pub: null,

            buttons: [
                {label: "Ajouter une image", class: "col-8",action: this.post},
                {label: "Publiez !", class: "d-flex justify-end col-4", action: this.publish },
            ]
        };
    },
    computed: {
        ...mapState(["postAnswer", "getAnswer"]),
    },
    methods: {
        ...mapActions(["post", "get"]),
        async publish() {
            //post publication
            // check if publication if empty   
            if(this.publication && services.checkPublication(this.publication)) {
                // check local storage
                if(localStorage.data != null && localStorage.data != undefined) {
                    // get data from localstorage
                    const data =  JSON.parse(localStorage.data);
                    const id = data.response.id;
                    const author = data.response.email;
                    const token = data.response.token;
                    // create payload
                    const payload = {
                    url: `${process.env.VUE_APP_SERVER_URL}${defines.PUBLISH_URL}`,
                        data: {
                            id: id,
                            pseudo: "mook",
                            author: author,
                            publication: this.publication,
                            postLike: 0,
                            postDislike: 0,
                            token: token,
                        }
                    };
                    // post publication
                    await this.post(payload);

                    const answer = JSON.parse(this.postAnswer);
                    // check if error from server 
                    if(answer.error != undefined && answer.error.code != undefined) {
                        switch(answer.error.code) {

                            /*** 
                             * This following code won't be used 
                             * cause no error to catch
                             * if create new error from server update this part
                             * and uncomment the code just below to add new
                             * case to the switch.
                             * 
                             * case "ER_UNK_USER":
                             *   this.textDial = "L’adresse email que vous avez saisie n’est associée à aucun un compte. Veuillez le vérifier et réessayer.";
                             *   this.dialog2 = true;
                             *   break;
                             * 
                            */

                            default:
                                throw new Error("Unknown error");    
                        }
                    }
                    // if no error from server 
                    else {
                        this.publication = "";
                    }
                }
                // if localstorage data is empty or undefined
                else {
                    this.textDial = "Une erreur s'est produite reconnectez-vous et réessayez"
                    this.errordial = true;
                }
            }
            // if publication is empty set error dialog
            else {

                this.textDial = "Vous ne pouvez pas créer de publication vide"
                this.errordial = true;
            }  
        },
        // function used for show or unshow home view
        trigger(payload) {
            this.ready = payload;
        },
        // function used to close error dialog
        close() {
            this.errordial = !this.errordial;
        },
    },
    async mounted() {
        // get publications
        if(localStorage.data != null && localStorage.data != undefined) {
            const data = JSON.parse(localStorage.data);
            const payload = {
                url: `${process.env.VUE_APP_SERVER_URL}${defines.PUBLISH_URL}`,
                data: {
                    token: data.response.token,
                }
            };
            await this.get(payload);
            const answer = JSON.parse(this.getAnswer);
            if(answer.results.length >= 1)
                this.pub = answer.results[0].text;


            
        }
    },
}
</script>
