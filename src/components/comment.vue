<template>
    <v-row class="comments">
        <!--Comment-title-->
        <v-container v-if="gotCom">
            <v-row>
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
                        <avatar :item="item" :size=40></avatar>
                </v-col>
                <!--comment-message-->
                <v-col v-if="item.parentId == pubId">
                    <v-container class="box body-2 pa-3" style="border: solid 1px grey; border-radius: 7px; background-color:#2962FF; box-shadow: 5px 5px 5px #424242; position: relative; z-index: 1;">
                        <div class="arrow" style="">&#9664;</div>
                        <v-row class="d-flex flex-column flex-sm-row pl-2 pt-1 white--text" >
                            <v-col class="text-decoration-underline flex-grow-0  text-no-wrap pa-0 pr-2 ">{{ item.pseudo }}</v-col>
                            <v-col class="font-italic pa-0 ">le {{ item.comTime }}</v-col>
                        </v-row>
                        <v-row class="align-center pl-2">
                            <v-col cols=10 class="pa-0 pt-2 white--text text-break" >{{ item.comText}}</v-col>
                            <v-col v-show="item.writerId == userData.userId || userData.rights == 'super'">
                                <v-btn 
                                icon 
                                color="red darken-3" 
                                style="position: absolute; top: 36%; right: -2px;" 
                                tag="button"
                                :loading="loading"
                                :disabled="loading"
                                @click="postDelCom({comId: item.comId, pubId: item.pubId})"
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
import { mapState, mapActions} from 'vuex';
import defines from '../defines/define';
import avatar from '../components/avatar.vue';
export default {
    name: "comment",
    components: {
        avatar,
    },
    props: {
        pubId: Number,
    },
    data() {
        return {
            loading: false,
        };
    },
    computed: {
        ...mapState([
            "userData", 
            "comments",
        ]),
        gotCom() {
            return this.comments.find(item => item.parentId == this.pubId);
        },
    },
    methods: {
        ...mapActions([
            "delCom"
        ]),
        postDelCom(data) {
            this.loading = true;
            this.delCom(data);
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