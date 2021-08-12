<template>
    <auth tab="profil" :auth_url="auth_url"  @onReady="trigger">
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
                <!--tabs-main-block-->
                <v-tabs-items>
                    <!--tabs-container-->
                    <v-tabs center-active centered>
                        <!--tab-Email-->
                        <v-tab>E-mail</v-tab>
                        <v-tab-item class="pa-4">
                            <v-card class="d-flex flex-column align-center justify-center mx-auto py-4" no-gutters elevation="5" color="grey lighten-3" max-width=1000 min-height=350>
                                <v-card-title>E-mail</v-card-title>
                                <v-card-text class="d-flex justify-center">{{ userData.email }}</v-card-text>
                            </v-card>
                        </v-tab-item>
                        <!--tab-description-->
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
                                ></v-textarea>
                                <v-btn @click="postDesc">Changer ma description</v-btn>
                            </v-card>
                        </v-tab-item>
                        <!--tab-password-->
                        <v-tab>Mot de passe</v-tab>
                        <v-tab-item class="pa-4">
                            <v-card class="d-flex flex-column align-center justify-center mx-auto py-4" no-gutters elevation="5" color="grey lighten-3" max-width=1000 min-height=350>
                                <v-card-title>Changer le mot de passe</v-card-title>
                                <v-form>
                                    <v-container fluid >
                                        <v-row class="d-flex flex-column">
                                            <v-col>
                                                <!--password-field-->
                                                <v-text-field
                                                    :append-icon="showPasswd ? 'mdi-eye' : 'mdi-eye-off'"
                                                    :rules="[rules.required, rules.min]"
                                                    :type="showPasswd ? 'text' : 'password'"
                                                    name="input-10-2"
                                                    hint="At least 8 characters"
                                                    value=""
                                                    placeholder="Mot de passe actuel"
                                                    class="input-group--focused"
                                                    @click:append="showPasswd = !showPasswd"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col>
                                                <!--confirme-password-field-->
                                                <v-text-field
                                                    :append-icon="showPasswd ? 'mdi-eye' : 'mdi-eye-off'"
                                                    :rules="[rules.required, rules.emailMatch]"
                                                    :type="showPasswd ? 'text' : 'password'"
                                                    name="input-10-2"
                                                    hint="At least 8 characters"
                                                    value=""
                                                    placeholder="Nouveau mot de passe"
                                                    error
                                                    @click:append="showPasswd = !showPasswd"
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-form>
                                <v-card-actions>
                                    <v-btn>Sauvegarder</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-tab-item>
                        <!--tab-account-->
                        <v-tab>Compte</v-tab>
                        <v-tab-item class="pa-4">
                            <v-card class="d-flex flex-column align-center justify-center mx-auto py-4" no-gutters elevation="5" color="grey lighten-3" max-width=1000 min-height=350>
                                <v-card-title>Supprimer mon compte</v-card-title>
                                <v-card-actions>
                                    <v-btn>Supprimer</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>
                </v-tabs-items>
            </v-card>
        </slot>
    </auth>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import auth from "../components/auth.vue";
import defines from '../defines/define';
export default {
    name: "profil",
    components: {
        auth,
    },
    data() {
        return {
            auth_url: `${defines.SERVER_URL}${defines.PROFIL_URL}`,
            showPage: false,
            showPasswd: false,
            description: "",
            rules: {
                required: value => !!value || 'Required.',
                min: v => v.length >= 8 || 'Min 8 characters',
                emailMatch: () => (`The password you entered don't match`),
            },
        };
    },
    computed: {
        ...mapState(["userData"]),
    },
    methods: {
        ...mapActions(["setNotifs"]),
        postDesc() {
            const payload = {
                description: this.description,
            };
            this.$http.put(`${defines.SERVER_URL}${defines.PROFIL_DESC_URL}`, payload)
            .then(
                (success) => {
                    success.text()
                    .then( token => {
                        localStorage.grpm_store = token;
                        this.userData.description = this.description;
                        this.description = "";
                    });
                },
                (/*failed*/) => {
                }
            );
        },
        putImg (event) { 

            let file = event.target.files[0];
            let fileReader = new FileReader();

            if(file) 
                fileReader.readAsDataURL(file);

            fileReader.addEventListener('load', function (){ 
            }, false);

            let payload = new FormData();
            payload.append("image", file, file.name);

            this.$http.put(`${defines.SERVER_URL}${defines.PROFIL_IMG_URL}`, payload)
            .then(
                (success) => {
                    success.text()
                        .then(token => {
                            localStorage.grpm_store = token;
                            this.userData.img = success.body.data.imgUrl;
                        });         
                },
                (/*failed*/) => {
                }
            );

        },
        onPickImg () { 
            this.$refs.fileInput.click();
        }, 
        // function used for show or unshow home view
        trigger(ready) {
            this.showPage = ready;                                                                                                                         
        },
        getNotifs() {
            return new Promise((resolve, reject) => {
                this.$http.get(`${defines.SERVER_URL}${defines.NOTIFICATION_URL}`)
                .then(
                    (success) => {
                        this.setNotifs(success.body.results);
                        resolve();
                    },
                    (failed) => { reject(failed); }
                );
            });
        },
        refresh() {
            this.getNotifs();
        },
    },
    mounted() {
        this.refresh();
    },

}
</script>
