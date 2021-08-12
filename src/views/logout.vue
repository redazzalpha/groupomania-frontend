<template>
  <div class="logout"></div>
</template>

<script>
import { mapActions } from 'vuex';
import defines from "../defines/define";
export default {
    name: "logout",
    methods: {
        ...mapActions(["setNotifs"]),
    },
    created() {
        this.setNotifs([]);
        localStorage.removeItem("grpm_store"); 
        this.$router.push(`${defines.ROOT_URL}`);
    }
}
</script>
