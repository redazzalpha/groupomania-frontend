<template>
    <div :class=tag>
        <div>
            <slot></slot>
        </div>
        <!--error-dialog-->
        <errordial 
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
import errordial from "../components/errordial.vue"

export default {
    name: "auth",
    components: {
        errordial,
    },
    props: {
        tag: String,
        auth_url: {
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
    },
    beforeMount() {
    
        // get request
        this.$http.get(this.auth_url)
        .then(
            (success) => {
                success.json()
                .then(json => {
                    this.dialogErr = false;
                    this.$emit("onReady", {ready: !this.dialogErr, json });
                });
            },
            (/*failed*/) =>{
                this.dialogErr = true;
                this.$emit("onReady", {ready: !this.dialogErr, json: null });
            } 
        );
    },
}
</script>

