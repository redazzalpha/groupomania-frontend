<template>
    <div :class=tag>
        <div>
            <slot></slot>
        </div>
        <!--error-dialog-->
        <errordial 
        v-if="useDialErr"
        title="Erreur système"
        text="Vous n'êtes pas authentifié."
        :model="dialogErr"
        >
            <slot>
                <v-row  class="d-flex flex-column" >
                    <v-card-text class="red--text pa-0">Veuillez vous connecter.</v-card-text>
                    <v-card-actions>
                        <v-btn to="/register" class="mb-3" color="primary">Se connecter</v-btn>
                    </v-card-actions>
                </v-row>
            </slot>
        </errordial>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
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
        };
    },
    methods: {
        ...mapActions([
            "access"
        ]),
    },
    beforeMount() {
        this.access(this.authUrl)
        .then(() => {
            this.dialogErr = false;
            this.$emit("onReady", !this.dialogErr)
        })
        .catch(() => {
            this.dialogErr = true;
            this.$emit("onReady", !this.dialogErr);
        });
    },
}
</script>

