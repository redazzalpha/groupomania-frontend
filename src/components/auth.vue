<template>
    <div :class=tag>
        <div>
            <slot></slot>
        </div>
        <!--error-dialog-->
        <errordial 
        title="Erreur système"
        text="Vous n'êtes pas authentifié."
        :model="!ready"
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
            ready: true,
        };
    },
    methods: {
    },
    beforeMount() {
    
        // post request
        this.$http.get(this.auth_url)
        .then(
            (success) => {
                success.json()
                .then(json => {
                    this.ready = true;
                    this.$emit("onReady", {ready: this.ready, json });
                });
            },
            (/*failed*/) =>{
                this.ready = false;
                this.$emit("onReady", {ready: this.ready, json: null });
            } 
        );
    },
}
</script>

