<template>
    <auth tab="profil" :authUrl="authUrl"  @onReady="trigger">
        <slot v-if="showPage">
            <h2 class="pa-5">Profil</h2>
            <!--main-card-container-->
            <v-card elevation=10 class="pb-4 ">
                <!--main-card-container-title-->
                <v-card-title class="d-flex justify-center">
                    <div style="position: relative">
                        <v-avatar size=100>
                            <v-img v-if="userData.img" :src="userData.img" />
                            <v-icon v-else size=100 color="primary">mdi-account-circle</v-icon>
                        </v-avatar>
                        <v-btn 
                            icon 
                            color="primary" 
                            style="position: absolute; top: 80px; left: 72px;"
                            title="Changer ma photo de profil"
                            @click="onPickImg"
                        >
                            <v-icon>mdi-camera</v-icon>
                        </v-btn> 
                        <input v-show="0" type="file" accept="image/*" ref="fileInput" @change="putImg" />
                    </div>
                </v-card-title>
                <v-card-text class="text-center">
                </v-card-text>
                <!--main-block-tabs-->
                <v-tabs-items>
                    <!--container-tabs-->
                    <v-tabs center-active centered>
                        <!--Email-tab-->
                        <v-tab>E-mail</v-tab>
                        <v-tab-item class="pa-4">
                            <v-card class="d-flex flex-column align-center justify-center mx-auto py-4" no-gutters elevation="5" color="grey lighten-3" max-width=1000 min-height=350>
                                <v-card-title>E-mail</v-card-title>
                                <v-card-text class="d-flex justify-center">{{ userData.email }}</v-card-text>
                            </v-card>
                        </v-tab-item>
                        <!--description-tab-->
                        <v-tab>Description</v-tab>
                        <v-tab-item class="pa-4">
                            <v-card class="d-flex flex-column align-center justify-center mx-auto py-4" no-gutters elevation="5" color="grey lighten-3" max-width=1000 min-height=350>
                                <v-card-title>Description</v-card-title>
                                <v-card-text class="d-flex justify-center">
                                    <div v-if="userData.description" class="text-center">{{ userData.description }}</div>
                                    <div v-else class="text-center">Vous n'avez pas encore de description</div>
                                </v-card-text>
                                <v-textarea 
                                v-model="description"
                                outlined  
                                no-resize auto-grow
                                rows=1
                                background-color="white" 
                                placeholder="Ajouter un texte"
                                counter
                                :rules="descRules"
                                ></v-textarea>
                                <v-btn 
                                :loading="loading" 
                                :disabled="loading"
                                @click="postDesc" 
                                >Changer ma description</v-btn>
                            </v-card>
                        </v-tab-item>
                        <!--password-tab--->
                        <v-tab>Mot de passe</v-tab>
                        <v-tab-item class="pa-4">
                            <v-card class="d-flex flex-column align-center justify-center mx-auto py-4" no-gutters elevation="5" color="grey lighten-3" max-width=1000 min-height=350>
                                <!--success-dialog-->
                                <v-alert v-if="success" outlined type="success" text dismissible>
                                    Votre mot de passe a été modifié avec succès
                                </v-alert>
                                <!--password-card-->
                                <v-card-title>Changer le mot de passe</v-card-title>
                                <v-form ref="passwdForm" v-model="passwdValid">
                                    <v-container fluid >
                                        <v-row class="d-flex flex-column">
                                            <v-col>
                                                <!--password-field-->
                                                <v-text-field
                                                    v-model="passwd"
                                                    hint="At least 8 characters"
                                                    placeholder="Mot de passe actuel"
                                                    :append-icon="showPasswd ? 'mdi-eye' : 'mdi-eye-off'"
                                                    :rules="passwdRules"
                                                    :type="showPasswd ? 'text' : 'password'"
                                                    @click:append="showPasswd = !showPasswd"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col>
                                                <!--confirm-password-field-->
                                                <v-text-field
                                                    v-model="passwdChange"
                                                    hint="At least 8 characters"
                                                    placeholder="Nouveau mot de passe"
                                                    :append-icon="showPasswd ? 'mdi-eye' : 'mdi-eye-off'"
                                                    :rules="passwdRules"
                                                    :type="showPasswd ? 'text' : 'password'"
                                                    @click:append="showPasswd = !showPasswd"
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-form>
                                <v-card-actions>
                                    <v-btn 
                                    :color='passwdValid? "success": ""'
                                    :disabled='!passwdValid'
                                    :loading='loading'
                                    @click="modifyPasswd"
                                    >Sauvegarder</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-tab-item>
                        <!--account-delete-tab-->
                        <v-tab>Compte</v-tab>
                        <v-tab-item class="pa-4">

                            <v-dialog
                                v-model="dialog"
                                persistent :overlay="false"
                                max-width="500px"
                                transition="dialog-top-transition"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-card class="d-flex flex-column align-center justify-center mx-auto py-4" no-gutters elevation="5" color="grey lighten-3" max-width=1000 min-height=350>
                                        <v-card-title>Supprimer mon compte</v-card-title>
                                        <v-card-actions>
                                            <v-btn
                                            color="red"
                                            v-on="on"
                                            >Supprimer</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </template>
                                <template v-slot>
                                    <v-alert 
                                    :value="dialog"
                                    dark
                                    shaped
                                    >
                                        <div primary-title class="text-center">
                                            Attenton &#x2757;
                                        </div>
                                        <v-card-text>
                                            <p>Vous êtes sur le point de supprimer votre compte. <br />
                                            Toutes les informations relatives a votre compte seront supprimées et seront donc irrécupérables.<br />
                                            Souhaitez-vous vraiment supprimer votre compte ?  
                                            </p>

                                        </v-card-text>
                                        <v-card-actions>
                                            <v-btn color="success"
                                            @click="dialog = false"
                                            >Annuler</v-btn>
                                            <v-spacer></v-spacer>
                                            <v-btn color="success"
                                            @click="delProf"
                                            >Oui</v-btn>
                                        </v-card-actions>
                                    </v-alert>
                                </template>
                            </v-dialog>
                        </v-tab-item>
                    </v-tabs>
                </v-tabs-items>
            </v-card>
            <!--error-dialog-->
            <errordial
            title="Erreur Système"
            :text="dialogErrText"
            :model="dialogErr"
            >
                <template v-slot:bottom>
                    <v-row>
                        <v-card-actions>
                            <v-btn @click="close">Ok</v-btn>
                        </v-card-actions>
                    </v-row>
                </template >
            </errordial>

        </slot>
    </auth>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import auth from "../components/auth.vue";
import errordial from "../components/errordial.vue";
import defines from '../defines/define';
import services from '../services/app.service';
export default {
    name: "profil",
    components: {
        auth,
        errordial,
    },
    data() {
        return {
            authUrl: `${defines.SERVER_URL}${defines.PROFIL_URL}`,
            passwd: "",
            passwdChange:"",
            description: "",
            showPage: false,
            passwdValid: false,
            showPasswd: false,
            loading: false,
            dialog:false,
            passwdRules:[
                services.requiredPasswd,
                services.passwdValidator,
            ],
            descRules: [
                services.max255,
            ],
        };
    },
    computed: {
        ...mapState([
            "userData",
            "dialogErr",
            "dialogErrText", 
            "success"
        ]),
    },
    methods: {
        ...mapActions([
            "setNotifs", 
            "uptPasswdProf", 
            "uptImgProf",
            "uptDescProf",
            "deleteProfil", 
            "setDialErr"
        ]),
        modifyPasswd() {
            if(this.$refs.passwdForm.validate()) {
                this.loading = true;
                this.uptPasswdProf({passwd: this.passwd, passwdChange: this.passwdChange})
                .then(() => {
                    this.$refs.passwdForm.reset();
                    setTimeout(() => {
                        this.loading = false;
                    }, defines.TIMEOUT);
                })
                .catch(() => {
                    setTimeout(() => {
                        this.loading = false;
                    }, defines.TIMEOUT);
                });
            }
        },
        postDesc() {
            // Empty string is authorized 
            // to delete previous description
            if(this.description.length <= 255) {
                this.loading = true;

                this.uptDescProf(this.description)
                .then( () => {
                    this.userData.description = this.description;
                    this.description = "";
                    setTimeout(() => { 
                        this.loading = false;
                    }, defines.TIMEOUT);
                })
                .catch( () => {
                    setTimeout(() => { 
                        this.loading = false;
                    }, defines.TIMEOUT);
                });
            }
        },
        putImg (event) { 
            let file = event.target.files[0];
            this.uptImgProf(file)
            .then( imgUrl => {
                this.userData.img = imgUrl;
            })
            .catch();
        },
        onPickImg () { 
            this.$refs.fileInput.click();
        }, 
        delProf() {
            this.deleteProfil(this.userData.userId)
            .then( () => this.$router.push(defines.REGISTER_URL) )
        },
        close() {
            this.setDialErr(false);
        },
        // function used for show or unshow home view
        trigger(ready) {
            this.showPage = ready;                                                                                                                         
        },
    },
}
</script>
