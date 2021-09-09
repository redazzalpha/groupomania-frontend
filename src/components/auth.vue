<template>
    <div :class="tag">
        <div>
            <slot></slot>
        </div>
        <!--error-dialog-->
        <errordial 
        v-if="useDialErr"
        title="Erreur système"
        :text="text"
        :model="dialogErr"
        >
            <slot>
                <v-row  class="d-flex flex-column" >
                    <v-card-actions>
                        <v-btn @click='click' class="mb-3" color="primary">{{ btnLabel }}</v-btn>
                    </v-card-actions>
                </v-row>
            </slot>
        </errordial>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import errordial from "../components/errordial.vue"
export default {
    name: "auth",
    components: {
        errordial,
    },
    props: {
        tag: String,
        useDialErr: {
            type: Boolean,
            default: true
        },
        authUrl: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            dialogErr: false,
            title: "",
            text: "",
            btnLabel: '',
            click: null,
        };
    },
    computed: {
        ...mapState([
            "userData",
            "locked",
        ])
    },
    methods: {
        ...mapActions([
            "access",
            "resetStore",
        ]),
        lockGoRgstr() {
            this.resetStore();
            this.$router.push('/register');
        },
        goRgstr() {
            this.$router.push('/register');
        }
    },
    async created() {
        try {
            await this.access(this.authUrl);
            this.dialogErr = false;
        }
        catch(error) {
            this.dialogErr = true;
            // error locked account
            if(this.userData.locked) {
                //localStorage.vuex = '';
                this.click = this.lockGoRgstr;
                this.text = 'Votre compte est bloqué.';
                this.btnLabel = 'Ok';
            }
            // error on unavailable server
            else if(error.status == 0) {
                this.click = this.goRgstr;
                this.text = `Le serveur est indisponible.`;
                this.btnLabel = 'Ok';
            }
            // error on authentification
            else {
                this.resetStore();
                this.click = this.goRgstr;
                this.text = 'Vous n\'êtes pas authentifié.';
                this.btnLabel = 'Se connecter';
            }
        }
        finally {
            this.$emit("onReady", !this.dialogErr)
        }
    },
}
</script>

