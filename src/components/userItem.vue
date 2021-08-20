<template>
    <v-hover v-slot="{ hover }">
        <v-card color="grey lighten-3" max-width=550 class="user-item mx-auto  pa-5 transition-swing" :elevation="hover ? 11 : 4" :ripple="false">
            <v-container grid-list-xs class="pa-0">
                <v-row>
                    <v-col class="d-flex flex-grow-0">
                        <v-avatar size="60" color="primary">
                            <v-img v-if="item.img" :src="item.img"  />
                            <v-icon v-else size= 50 color="white">mdi-account</v-icon>
                        </v-avatar>
                    </v-col>
                    <v-col class="d-flex align-center justify-center">
                        {{ item.pseudo }}
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-hover>
</template>

<script>
export default {
    name: "usercard",
    props: {
        hover: Boolean,
        item: Object,
    },
}
</script>
<style lang="scss" scoped>
.user-item:hover{
    cursor: pointer;
}
</style>

