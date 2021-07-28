<template>
    <div class="profil">
        <h2 class="pa-5">Mon profil</h2>
        <!--main-card-container-->
        <v-card elevation=10 class="pb-4 pt-8">
            <!--main-card-container-title-->
            <v-card-title class="d-flex justify-center"><v-avatar size=100><img src="../assets/user_wolf.jpg" alt=""></v-avatar></v-card-title>
            <!--tabs-main-block-->
            <v-tabs-items>
                <!--tabs-container-->
                <v-tabs center-active centered>
                    <!--tab-Email-->
                    <v-tab>E-mail</v-tab>
                    <v-tab-item class="pa-4">
                        <v-card class="d-flex flex-column align-center justify-center ma-auto pb-4 pt-4" no-gutters elevation="5" color="grey lighten-3" max-width=1000 min-height=350>
                            <v-card-title>E-mail</v-card-title>
                            <v-card-text class="d-flex justify-center">redazzwolf@gmail.com</v-card-text>
                        </v-card>
                    </v-tab-item>
                    <!--tab-description-->
                    <v-tab>Description</v-tab>
                    <v-tab-item class="pa-4">
                        <v-card class="d-flex flex-column align-center justify-center ma-auto pb-4 pt-4" no-gutters elevation="5" color="grey lighten-3" max-width=1000 min-height=350>
                            <v-card-title>Description</v-card-title>
                            <v-card-text class="d-flex justify-center">Yeah that's me!</v-card-text>
                            <v-textarea background-color="white" outlined  placeholder="Ajouter un texte"></v-textarea>
                            <v-btn to="/home">Changer ma description</v-btn>
                        </v-card>
                    </v-tab-item>
                    <!--tab-password-->
                    <v-tab>Mot de passe</v-tab>
                    <v-tab-item class="pa-4">
                        <v-card class="d-flex flex-column align-center justify-center ma-auto pb-4 pt-4" no-gutters elevation="5" color="grey lighten-3" max-width=1000 min-height=350>
                            <v-card-title>Changer le mot de passe</v-card-title>
                            <v-form>
                                <v-container fluid >
                                    <v-row class="d-flex flex-column">
                                        <v-col>
                                            <v-text-field
                                                :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                                                :rules="[rules.required, rules.min]"
                                                :type="show3 ? 'text' : 'password'"
                                                name="input-10-2"
                                                hint="At least 8 characters"
                                                value=""
                                                placeholder="Mot de passe actuel"
                                                class="input-group--focused"
                                                @click:append="show3 = !show3"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field
                                                :append-icon="show4 ? 'mdi-eye' : 'mdi-eye-off'"
                                                :rules="[rules.required, rules.emailMatch]"
                                                :type="show4 ? 'text' : 'password'"
                                                name="input-10-2"
                                                hint="At least 8 characters"
                                                value=""
                                                placeholder="Nouveau mot de passe"
                                                error
                                                @click:append="show4 = !show4"
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
                        <v-card class="d-flex flex-column align-center justify-center ma-auto pb-4 pt-4" no-gutters elevation="5" color="grey lighten-3" max-width=1000 min-height=350>
                            <v-card-title>Supprimer mon compte</v-card-title>
                            <v-card-actions>
                                <v-btn>Supprimer</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-tab-item>
                </v-tabs>
            </v-tabs-items>
        </v-card>

        <!-- 
            //THIS IS FIRST VERSION OF PROFIL VIEW

        <v-card elevation="5" color="grey lighten-3" max-width=1000 class="ma-auto">
            <v-container class="d-flex flex-column  flex-md-row align-center">

                <v-row class="d-flex flex-sm-column align-center" no-gutters>
                    <v-avatar color="primary" size="100">
                        <img src="../assets/user_wolf.jpg" alt="user image">
                    </v-avatar>
                    <v-card-title>RedazzWolf</v-card-title>                 
                    <v-card-actions class="d-flex align-self-auto">
                        <v-file-input
                            accept="image/png, image/jpeg, image/bmp"
                            placeholder="Changer mon avatar"
                            prepend-icon="mdi-camera"
                            label="Avatar"
                            rounded
                        ></v-file-input>
                    </v-card-actions>
                </v-row>

                <v-row class="d-flex flex-column align-center" no-gutters>
                    <v-card-title>E-mail</v-card-title>
                    <v-card-text class="d-flex justify-center">redazzwolf@gmail.com</v-card-text>
                    <v-card-title>Description</v-card-title>
                    <v-card-text class="d-flex justify-center">Yeah that's me!</v-card-text>
                    <v-textarea background-color="white" outlined rows=1 placeholder="Ajouter un texte"></v-textarea>
                    <v-btn to="/home">Changer ma description</v-btn>
                </v-row>

                <v-row class="d-flex flex-column align-center" no-gutters>
                    <v-card-title>Changer le mot de passe</v-card-title>
                    <v-form>
                        <v-container fluid >
                            <v-row class="d-flex flex-column">
                                <v-col>
                                    <v-text-field
                                        :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                                        :rules="[rules.required, rules.min]"
                                        :type="show3 ? 'text' : 'password'"
                                        name="input-10-2"
                                        hint="At least 8 characters"
                                        value=""
                                        placeholder="Mot de passe actuel"
                                        class="input-group--focused"
                                        @click:append="show3 = !show3"
                                    ></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field
                                        :append-icon="show4 ? 'mdi-eye' : 'mdi-eye-off'"
                                        :rules="[rules.required, rules.emailMatch]"
                                        :type="show4 ? 'text' : 'password'"
                                        name="input-10-2"
                                        hint="At least 8 characters"
                                        value=""
                                        placeholder="Nouveau mot de passe"
                                        error
                                        @click:append="show4 = !show4"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                    <v-card-actions>
                        <v-btn>Sauvegarder</v-btn>
                    </v-card-actions>
                    <v-card-title>Supprimer mon compte</v-card-title>
                    <v-card-actions>
                        <v-btn>Supprimer</v-btn>
                    </v-card-actions>
                </v-row>

            </v-container>
        </v-card>
    -->

    </div>
</template>

<script>
export default {
    name: "profil",
    data() {
        return {
            show1: false,
            show2: true,
            show3: false,
            show4: false,
            password: 'Password',
            rules: {
                required: value => !!value || 'Required.',
                min: v => v.length >= 8 || 'Min 8 characters',
                emailMatch: () => (`The password you entered don't match`),
            },
            defaultButtonText:"Changer mon avatar",
            selectedFile: null,
            isSelecting: false,
        };
    },
    computed: {
        buttonText() {
        return this.selectedFile ? this.selectedFile.name : this.defaultButtonText
        }
    },
    methods: {
        onButtonClick() {
        this.isSelecting = true
        window.addEventListener('focus', () => {
            this.isSelecting = false
        }, { once: true })

        this.$refs.uploader.click()
        },
        onFileChanged(e) {
        this.selectedFile = e.target.files[0]
        
        // do something
        }
    }

}
</script>

<style lang="scss" scoped>
</style>