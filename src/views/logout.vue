<template>
  <div class="logout"></div>
</template>

<script>
import defines from "../defines/define";
export default {
    name: "logout",
    beforeCreate() {
        localStorage.removeItem("grpm_store"); 
        this.$router.push(`${defines.ROOT_URL}`);
    }
}
</script>
