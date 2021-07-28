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
import errordial from "../components/errordial.vue"
import defines from "../defines/define";

export default {
    name: "auth",
    components: {
        errordial,
    },
    props: {
        tag: String,
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
    async created() {        
        if(localStorage.data != null && localStorage.data != undefined) {
            const payload = {
                url: `${process.env.VUE_APP_SERVER_URL}${defines.HOME_URL}`,
                data: JSON.parse(localStorage.data).response,
            };
            await this.get(payload);    
            if(JSON.parse(this.getAnswer).error == undefined)
                this.ready = true;
            else this.ready = false;
        }
        else this.ready = false;

        this.$emit("onReady", this.ready);
    },
}
</script>

