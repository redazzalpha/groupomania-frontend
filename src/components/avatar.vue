<template>
    <v-avatar :size="size">
        <v-img v-if="item.img" :src="item.img"  />
        <v-img v-else-if="item.rights == 'super'" src="http://localhost:4000/img/super_user.png" />
        <v-icon v-else :size="size" color="primary">mdi-account-circle</v-icon>
    </v-avatar>
</template>

<script>
export default {
    name: 'avatar',
    props: {
        item: Object,
        size: {type: Number, default: 60}
    },
}
</script>