<template>
  <div class="logout"></div>
</template>

<script>
import { mapActions } from 'vuex';
import defines from "../defines/define";
export default {
    name: "logout",
    methods: {
        ...mapActions([
            "resetStore",
        ]),
    },
    created() {
        this.resetStore();
        this.$router.push(`${defines.ROOT_URL}`);
    }
}
</script>
