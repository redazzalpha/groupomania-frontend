<template>
    <v-avatar :size="size">
        <v-img v-if="item && item.img" :src="item.img"  />
        <v-img v-else-if="item && item.rights == 'super'" :src="defaultImgUrl" />
        <v-icon v-else :size="size" color="primary">mdi-account-circle</v-icon>
    </v-avatar>
</template>

<script>
import defines from '../defines/define';
export default {
    name: 'avatar',
    props: {
        item: Object,
        size: {type: Number, default: 60}
    },
    data() {
        return {
            defaultImgUrl: `${defines.SERVER_URL}${defines.DEF_SU_IMG_URL}`
        };
    },
}
</script>