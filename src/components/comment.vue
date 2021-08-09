<template>
    <v-row v-if="comPubId == pubId" class="pl-5 pr-5 mb-1">
        <v-col v-if="comPubId == pubId" class="flex-grow-0 d-flex align-center pr-2">
            <v-avatar size=40>
                <v-img v-if="comImg" :src="comImg"  />
                <v-icon v-else size=40>mdi-account-circle</v-icon>
            </v-avatar>
        </v-col>
        <v-col v-if="comPubId == pubId">
            <v-container class="box body-2 pa-3" style="border: solid 1px grey; border-radius: 7px; background-color:#2962FF; box-shadow: 5px 5px 5px #424242; position: relative; z-index: 1;">
                <div class="arrow" style="">&#9664;</div>
                <v-row class="pl-2 pt-1 white--text"> 
                    <v-col class="text-decoration-underline flex-grow-0 pa-0">{{ comPseudo}}</v-col>
                    <v-col class="font-italic pa-0 pl-2 flex-grow-1">le {{ comTime}}</v-col>
                </v-row>
                <v-row class="align-center pl-2">
                    <v-col cols=10 class="pa-0 pt-1 white--text" style="word-break: break-all;">{{ comText}}</v-col>
                    <v-col v-show="comUserId == userId"  >
                        <v-btn icon color="red darken-3" style="position: absolute; top: 36%; right: -2px;" @click="delCom"><v-icon class="white--text">mdi-delete-sweep</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: "comment",
    props: {
        userId: Number,
        pubId: Number,
        comUserId: Number,
        comPubId: Number,
        comId: Number,
        comImg: String,
        comPseudo: String,
        comTime: String,
        comText: String,
    },
    methods: {
        delCom() {
            this.$emit("delCom", this.comId);
        },
    }
}
</script>

<style lang="scss" scoped>
.box {
    
}
.arrow {
    position: absolute;
    left: -17px;
    top: 35%;
    color: #2962FF;
    z-index: 100;
    font-size: 2em;
}
</style>