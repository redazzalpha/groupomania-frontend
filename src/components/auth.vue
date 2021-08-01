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
import { mapActions, mapState } from "vuex";
import defines from "../defines/define";
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
    computed: {
        ...mapState(["getAnswer"]),
    },
    methods: {
        ...mapActions(["get"]),
    },
    beforeMount() {       
    
        if(localStorage.grpm_store != null && localStorage.grpm_store != undefined) {

            const grpm_store = JSON.parse(localStorage.grpm_store);
            
            // create payload
            let payload = {
                url: `${this.auth_url}`,
                data: {
                    token: grpm_store.data.token,
                    tokenRefresh: grpm_store.data.tokenRefresh,
                },
            };

            // create headers
            const head = {
                "Accept": "application/json",
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${payload.data.token}`,
            };

            // post request
            this.$http.get(`${process.env.VUE_APP_SERVER_URL}${defines.HOME_URL}`,  { headers: head })
            .then(
                (/*success*/) => {
                    this.ready = true;
                    this.$emit("onReady", true);
                },
                (/*failed*/) => {
                    this.ready = false;
                    this.$emit("onReady", false);
                }
            );
        }
        else {
                this.ready = false;
                this.$emit("onReady", false);
        }
    },
}
</script>

