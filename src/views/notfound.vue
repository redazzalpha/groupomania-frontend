<template>
    <h1 :class="'pa-5 ' + (darkMode?'white':'black') + '--text'">404 Not found</h1>
</template>

<script>
import {mapState } from 'vuex';
export default {
    name: 'notFound',
    computed: {
        ...mapState([
            "darkMode",
        ]),
    },
}
</script>