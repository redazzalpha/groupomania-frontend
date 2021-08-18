<template>
    <v-row class="comments">
        <!--Comment-title-->
        <v-container>
            <v-row v-if="comments.length >= 1">
                <v-col class="text-decoration-underline">
                    Commentaires:
                </v-col>
            </v-row>
        </v-container>
        <!--comment-row-->
        <v-container v-for="item in comments" :key="item.comId" class="pa-0">
            <v-row v-if="item.parentId == pubId" class="pl-5 pr-5 mb-1">
                <!--avatar-->
                <v-col v-if="item.parentId == pubId" class="flex-grow-0 d-flex align-center pr-2">
                    <v-avatar size=40>
                        <v-img v-if="item.img" :src="item.img" />
                        <v-icon v-else size=40>mdi-account-circle</v-icon>
                    </v-avatar>
                </v-col>
                <v-col v-if="item.parentId == pubId">
                    <v-container class="box body-2 pa-3" style="border: solid 1px grey; border-radius: 7px; background-color:#2962FF; box-shadow: 5px 5px 5px #424242; position: relative; z-index: 1;">
                        <div class="arrow" style="">&#9664;</div>
                        <v-row class="pl-2 pt-1 white--text"> 
                            <v-col class="text-decoration-underline flex-grow-0 pa-0">{{ item.pseudo}}</v-col>
                            <v-col class="font-italic pa-0 pl-2 flex-grow-1">le {{ item.comTime.substring(0,20)}}</v-col>
                        </v-row>
                        <v-row class="align-center pl-2">
                            <v-col cols=10 class="pa-0 pt-1 white--text" style="word-break: break-all;">{{ item.comText}}</v-col>
                            <v-col v-show="item.writerId == userData.userId">
                                <v-btn 
                                icon 
                                color="red darken-3" 
                                style="position: absolute; top: 36%; right: -2px;" 
                                :loading="loading"
                                :disabled="loading"
                                @click="delCom({comId: item.comId, pubId: item.pubId})"
                                >
                                    <v-icon class="white--text">mdi-delete-sweep</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-col>
            </v-row>
        </v-container>
    </v-row>
</template>

<script>
import { mapState } from 'vuex';
import defines from '../defines/define';
export default {
    name: "comment",
    props: {
        pubId: Number,
    },
    data() {
        return {
            loading: false,
        };
    },
    computed: {
        ...mapState(["userData", "comments"]),
    },
    methods: {
        delCom(data) {
            this.loading = true;
            this.$emit("delCom", data);
            setTimeout(() => {this.loading = false}, defines.TIMEOUT);
        },
    }
}
</script>

<style lang="scss" scoped>
.arrow {
    position: absolute;
    left: -17px;
    top: 22%;
    color: #2962FF;
    z-index: 100;
    font-size: 2em;
}
</style>