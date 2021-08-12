<template>
    <auth tab="team" :auth_url="auth_url"  @onReady="trigger">
        <slot v-if="showPage">
            <h2 class="pa-5">&Eacute;quipe</h2>
        </slot>
    </auth>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import auth from "../components/auth.vue";
import defines from "../defines/define";
export default {
    name: "team",
    components: {
        auth,
    },
    data() {
        return {
            auth_url: `${defines.SERVER_URL}${defines.TEAM_URL}`, 
            showPage: false,
        };
    },
    computed: {
        ...mapState(["notifs"]),
    },
    methods: {
        ...mapActions(["setNotifs"]),
        getNotifs() {
            return new Promise((resolve, reject) => {
                this.$http.get(`${defines.SERVER_URL}${defines.NOTIFICATION_URL}`)
                .then(
                    (success) => {
                        this.setNotifs(success.body.results);
                        this.empty = !this.notifs.length >= 1;
                        resolve();
                    },
                    (failed) => { reject(failed); }
                );
            });
        },
        refresh() {
            this.getNotifs();
        },
        // function used for show or unshow home view
        trigger(ready) {
            this.showPage = ready;                                                                                                                         
        },
    },
    mounted() {
        this.refresh();
    },
}
</script>

