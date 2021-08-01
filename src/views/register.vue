<template>
    <div>
        <!--dialog-login-register-window-->
        <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px" :retain-focus="false">
            <div class="main-block">
                <!--main-tab-container-->
                <v-tabs v-model="tab" show-arrows background-color="primary" icons-and-text dark grow>
                    <v-tabs-slider color="red"></v-tabs-slider>
                    <!--all-tabs-creation-->
                    <v-tab v-for="i in tabs" :key="i.name">
                        <v-icon large>{{ i.icon }}</v-icon>
                        <div class="caption py-1">{{ i.name }}</div>
                    </v-tab>
                    <!--tab-login-->
                    <v-tab-item>
                        <v-card class="px-4">
                            <v-card-text>
                                <v-form ref="loginForm" v-model="loginValid" lazy-validation>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-text-field v-model="loginEmail" :rules="emailRules" label="E-mail" ></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="loginPassword" :append-icon="show1?'mdi-eye':'mdi-eye-off'" :rules="[passwdRules.required, passwdRules.validate]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Password" hint="8 caractères minimum" counter @click:append="show1 = !show1"></v-text-field>
                                        </v-col>
                                        <v-col class="d-flex" cols="12" sm="6" xsm="12">
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                                            <v-btn large block :disabled="!loginValid" color="success" @click="validateLogin">Connection</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <!--tab-register-->
                    <v-tab-item>
                        <v-card class="px-4">
                            <v-card-text>
                                <v-form ref="registerForm" v-model="registerValid" lazy-validation>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-text-field v-model="pseudo" :rules="fieldRules" label="Pseudo" maxlength="20"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="email" :rules="emailRules" label="E-mail"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="password" :rules="[passwdRules.required, passwdRules.validate]" :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" :type="show2 ? 'text' : 'password'" name="input-10-1" label="Mot de passe" hint="8 caractères minimum" counter @click:append="show2 = !show2"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field block v-model="verify" :rules="[passwdRules.required, passwdRules.validate, passwdMatch]" :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" :type="show2 ? 'text' : 'password'" name="input-10-1" label="Confirmez mot de passe" counter @click:append="show2 = !show2"></v-text-field>
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                                            <v-btn large block :disabled="!registerValid" color="success" @click="validateRegister">S'inscrire</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs>
            </div>
        </v-dialog>
        <!--dialog-error-window-->
        <errordial 
        title="Erreur système"
        :text="textDialog"
        :model="dialog2"
        >
        <template v-slot:bottom>
            <v-row>
                <v-card-actions>
                    <v-btn @click="close">Ok</v-btn>
                </v-card-actions>
            </v-row>
        </template >
        </errordial>
    </div>

</template>

<script>
import { mapActions, mapState } from "vuex";
import services from "../services/register.service";
import defines from "../defines/define";
import errordial from "../components/errordial.vue";
export default {
    name: "register",
    components: {
        errordial,
    },
    data() {
        return {
            dialog: true,
            dialog2 : false,
            textDialog: "",
            loginValid: false,
            registerValid: false,
            show1: false,
            show2: false,
            loginEmail: "",
            loginPassword: "",
            pseudo: "",
            email: "",
            password: "",
            verify: "",
            fromRgstr: null,
            tab: 0,

            tabs: [
                {name:"Se connecter", icon:"mdi-account"},
                {name:"S'inscrire", icon:"mdi-account-outline"}
            ],
            emailRules: [
                value => !!value || "Adresse e-mail requise.",
                services.emailValidator,
            ],
            passwdRules: {
                required: value => !!value || "Mot de passe requis",
                validate: services.passwdValidator,
            },
            fieldRules: [
                value => !!value || "Champ requis",
                services.fieldValidator,
            ],
        };
    },
    computed: {
        ...mapState(["postAnswer"]),
        passwdMatch() {
            return () => this.password === this.verify || "Les mots de passes ne sont pas identiques";
        },
    },
    methods: {
        ...mapActions(["post"]),
        validateLogin() {
            if (this.fromRgstr || this.$refs.loginForm.validate()) {

                // create payload
                let payload = {
                    url: `${process.env.VUE_APP_SERVER_URL}${defines.LOGIN_URL}`,
                    data: {
                        email: this.fromRgstr? this.fromRgstr.email : this.loginEmail,
                        password: this.fromRgstr? this.fromRgstr.password : this.loginPassword, 
                    }
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
                    success => {
                        success.text()
                        .then(text => {
                            localStorage.grpm_store = text;
                            this.$router.push(defines.HOME_URL);
                        });
                    },
                    failed => {
                        failed.json()
                        .then(json => {
                            switch(json.error.code) {
                                case "ER_UNK_USER":
                                    this.textDialog = "L’adresse email que vous avez saisie n’est associée à aucun un compte. Veuillez le vérifier et réessayer.";
                                    this.dialog2 = true;
                                    break;
                                case "ER_INV_PASS":
                                    this.textDialog = "Le mot de passe que vous avez saisi est invalide";
                                    this.dialog2 = true;
                                    break;
                                default:
                                    throw new Error("Unknown error");    
                            }
                        });
                    }
                );
            }
        },
        validateRegister() {
            if (this.$refs.registerForm.validate()) {

                //create paylod
                let payload = {
                    url: `${process.env.VUE_APP_SERVER_URL}${defines.SIGNUP_URL}`,
                    data: {
                        pseudo: this.pseudo,
                        email: this.email,
                        password: this.password,
                        token: "",
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
                        this.fromRgstr = {email: this.email, password: this.password};
                        this.validateLogin();
                    },
                    failed => {
                        failed.json()
                        .then(json => {
                            switch(json.error.code) {
                                case "ER_DUP_ENTRY":
                                    this.dialog2 = true;
                                    this.textDialog = "L'utilisateur que vous essayez de créer existe déjà.";
                                    break;
                                default:
                                    throw new Error("Unknown error");    
                            }
                        });
                    }
                );
            }
        },
        reset() {
            this.$refs.form.reset();
        },
        resetValidation() {
            this.$refs.form.resetValidation();
        },
        close() {
            this.dialog2 = !this.dialog2;
        },
    },
    created() {
        // auto loggin
        if(localStorage.grpm_store != null && localStorage.grpm_store != undefined) {
            this.dialog = false;
            this.$router.push(defines.HOME_URL);
        }
    },
    
}
</script>

