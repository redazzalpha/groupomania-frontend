<template>
    <div>
        <!--dialog-login-register-window-->
        <v-dialog v-model="dialogSign" persistent max-width="600px" min-width="360px" :retain-focus="false">
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
                            <!--login-card-->
                            <v-card-text>
                                <v-form ref="loginForm" v-model="loginValid" lazy-validation>
                                    <v-row>
                                        <!--email-field-->
                                        <v-col cols="12">
                                            <v-text-field 
                                            v-model="emailLogin" 
                                            label="E-mail"
                                            :rules="emailRules"
                                            ></v-text-field>
                                        </v-col>
                                        <!--password-field-->
                                        <v-col cols="12">
                                            <v-text-field 
                                            counter 
                                            v-model="passwdLogin" 
                                            label="Password" 
                                            hint="8 caractères minimum" 
                                            :type="showLoginfield ? 'text' : 'password'" 
                                            :append-icon="showLoginfield?'mdi-eye':'mdi-eye-off'"
                                            :rules="passwdRules"
                                            @click:append="showLoginfield = !showLoginfield"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col class="d-flex" cols="12" sm="6" xsm="12"></v-col>
                                        <v-spacer></v-spacer>
                                        <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                                            <!--login-button-->
                                            <v-btn
                                            text
                                            large block 
                                            :color='loginValid? "success": ""'
                                            :disabled="!loginValid"
                                            :loading='loading'
                                            @click="validateLogin"
                                            >Connection</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <!--tab-register-->
                    <v-tab-item>
                        <v-card class="px-4">
                            <!--register-card-->
                            <v-card-text>
                                <v-form ref="registerForm" v-model="registerValid" lazy-validation>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-text-field v-model="pseudoRgstr" :rules="fieldRules" label="Pseudo" maxlength="20"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="emailRgstr" :rules="emailRules" label="E-mail"></v-text-field>
                                        </v-col>
                                        <!--Password-field-->
                                        <v-col cols="12">
                                            <v-text-field
                                            counter 
                                            v-model="passwdRgstr" 
                                            label="Mot de passe" 
                                            hint="8 caractères minimum"
                                            :rules="passwdRules" 
                                            :append-icon="showRgstrField ? 'mdi-eye' : 'mdi-eye-off'"
                                            :type="showRgstrField ? 'text' : 'password'" 
                                            @click:append="showRgstrField = !showRgstrField"
                                            ></v-text-field>
                                        </v-col>
                                        <!--Password-verify-field-->
                                        <v-col cols="12">
                                            <v-text-field 
                                            counter  
                                            v-model="verifyPasswds" 
                                            name="input-10-1" 
                                            label="Confirmez mot de passe" 
                                            :rules="[passwdRules[0], passwdRules[1], passwdMatch]" 
                                            :append-icon="showRgstrField ? 'mdi-eye' : 'mdi-eye-off'" 
                                            :type="showRgstrField ? 'text' : 'password'" 
                                            @click:append="showRgstrField = !showRgstrField"
                                            ></v-text-field>
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <!--register-button-->
                                        <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                                            <v-btn 
                                            text
                                            large block 
                                            :color='registerValid? "success": ""'
                                            :disabled="!registerValid" 
                                            :loading='loading'
                                            @click="validateRegister"
                                            >S'inscrire</v-btn>
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
    </div>

</template>

<script>
import { mapState,mapActions }  from'vuex';
import services from "../services/app.service";
import defines from "../defines/define";
import errordial from "../components/errordial.vue";
export default {
    name: "register",
    components: {
        errordial,
    },
    data() {
        return {
            emailLogin: "",
            passwdLogin: "",
            pseudoRgstr: "",
            emailRgstr: "",
            passwdRgstr: "",
            verifyPasswds: "",
            loginValid: false,
            registerValid: false,
            showLoginfield: false,
            showRgstrField: false,
            dialogSign: false,
            loading: false,
            tab: 0,

            tabs: [
                {name:"Se connecter", icon:"mdi-account"},
                {name:"S'inscrire", icon:"mdi-account-outline"}
            ],
            emailRules: [
                services.requiredEmail,
                services.emailValidator,
            ],
            passwdRules: [
                services.requiredPasswd,
                services.passwdValidator,
            ],
            fieldRules: [
                services.requiredField,
                services.fieldValidator,
            ],
        };
    },
    computed: {
        ...mapState([
            "dialogErr",
            "dialogErrText", 
        ]),
        passwdMatch() {
            return () => this.passwdRgstr === this.verifyPasswds || "Les mots de passes ne sont pas identiques";
        },
    },
    methods: {
        ...mapActions([
            "access",
            "login",
            "register",
            "setDialErr"
        ]),
        validateLogin() {
            if (this.$refs.loginForm.validate()) {
                this.loading = true;
                const payload = {
                    email: this.emailLogin,
                    password: this.passwdLogin, 
                };

                this.login(payload)
                .then( () => this.$router.push(defines.HOME_URL) )
                .catch(() => {
                    setTimeout(() => {
                        this.loading = false;
                    }, defines.TIMEOUT);
                });

            }
        },
        validateRegister() {
            if (this.$refs.registerForm.validate()) {
                this.loading = true;

                const payload = {
                    pseudo: this.pseudoRgstr,
                    email: this.emailRgstr,
                    password: this.passwdRgstr,
                };

                this.register(payload)
                .then( () => this.$router.push(defines.HOME_URL) )
                .catch(() => this.$refs.registerForm.resetValidation())

                setTimeout(() => {
                    this.loading = false;
                    this.registerValid = false;
                }, defines.TIMEOUT);
            }
        },
        close() {
            this.setDialErr(false);
        },
    },
    created() {
        // auto logging
        this.access(`${defines.SERVER_URL}${defines.AUTO_LOG_URL}`)
        .then(
            (/*success*/) => {
                this.$router.push(defines.HOME_URL);
            },
            (/*failed*/) => {
                this.dialogSign = true;
            }
        );
    },
}
</script>

