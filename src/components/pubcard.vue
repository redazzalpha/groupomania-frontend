<template>
    <!--Publications-cards-->
    <v-card max-width=550 class="ma-auto mt-8" elevation="15" outlined color="grey lighten-1" shaped>
        <v-container >
            <!--title-row-->
            <v-row no-gutters>
                <v-col class="flex-grow-0">
                    <v-avatar size=60>
                        <v-img v-if="pubImg != 'null'" :src="pubImg" width=50% />
                        <v-icon v-else size=65 >mdi-account-circle</v-icon>
                    </v-avatar>
                </v-col>
                <v-col>
                    <v-container class="pa-0 pl-1">
                        <v-row no-gutters class="subtitle-1 blue--text text--darken-4">
                            <v-col>{{ pubPseudo }}</v-col>
                            <v-col class="text-right" v-show="pubUserId == userId">
                                <v-btn
                                icon 
                                color="red darken-3"
                                title="Supprimer la publication"
                                @click="delPub"
                                >
                                    <v-icon>mdi-close-circle</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row no-gutters class="body-2 font-italic">
                            <v-col>publié le {{ pubTime }}</v-col>
                        </v-row>
                    </v-container>
                </v-col>
            </v-row>
            <!--horizontal-line-separation-->
            <v-row><v-divider></v-divider></v-row>
            <!--publication-row-->
            <v-row>
                <v-col>
                    <!--
                    style="box-shadow: 5px 5px 5px grey; background-color: white; border-radius: 5px;"
                    -->
                    <v-card-text class="subtitle-1">{{ pubText }}</v-card-text>
                </v-col>
            </v-row>
            <!--horizontal-line-separation-->
            <v-row><v-divider></v-divider></v-row>
            <!--like-dislike-row-->
            <v-row>
                <v-col v-for="item in buttons" :key="item.title" class="pr-0 pl-0">
                    <v-btn width="100%" :title="item.title" @click="item.action">
                        <v-icon>{{ item.icon }}</v-icon> {{ item.count }}
                    </v-btn>
                </v-col>
            </v-row>
            <v-row v-if="comments.length >= 1">
                <v-col class="text-decoration-underline">
                    Commentaires:
                </v-col>
            </v-row>
            <!--comments-row-->
            <v-row v-for="item in comments" :key="item.comId">
                <comment
                :userId="userId"
                :pubId="pubId"
                :comUserId="item.userId"
                :comPubId="item.pubId"
                :comId="item.comId"
                :comImg="item.img"
                :comPseudo="item.pseudo"
                :comTime="item.time.substring(0,19)"
                :comText="item.text"
                @delCom="delCom"
                ></comment>
            </v-row>
            <!--add-comment-row-->
            <v-row>
                <v-card-text>   
                    <v-row>
                        <v-textarea v-model="comText" background-color="white" placeholder="Votre commentaire" solo rounded rows="1" auto-grow full-width outlined no-resize>
                            <template v-slot:prepend>
                                <v-avatar size=40>
                                    <v-img v-if="userImg" :src="userImg"  />
                                    <v-icon v-else size=40 color="primary">mdi-account-circle</v-icon>
                                </v-avatar>
                            </template>
                            <template v-slot:append>
                                <v-btn title="Envoyer" icon size=40 color="primary" @click="comment"><v-icon>mdi-send</v-icon></v-btn>
                            </template>
                        </v-textarea>
                    </v-row>
                </v-card-text>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
import defines from "../defines/define";
import comment from "../components/comment.vue";
export default {
    name: "pubcard",
    components: {
        comment,
    },
    props: {
        userId: Number,
        userImg: String,
        pubId: Number,
        pubUserId: Number,
        pubPseudo: String,
        pubImg: String,
        pubText: String,
        pubTime: String,
        pubLike: Number,
        pubDislike: Number,
        comments: Array,
    },
    data() {
        return {
            comText: "",
            buttons: [
                {title: "J'aime", icon: "mdi-thumb-up", count: this.pubLike, action: this.like},
                {title: "Je n'aime pas", icon: "mdi-thumb-down", count: this.pubDislike, action: this.dislike},
            ],
        };
    },
    methods: {
        comment() {
            this.$emit("comment", {pubId: this.pubId, comText: this.comText});
            this.comText = "";
        },
        delCom(comId) {
            const payload = { comId };
            this.$http.post(`${defines.SERVER_URL}${defines.COMMENT_DEL_URL}`, payload)
            .then(
                (/*success*/) => {
                    this.$emit("refresh");
                },
                (/*failed*/) => {
                }
            );
        },
        delPub() {
            this.$emit("delPub", this.pubId);
        },
        like(){
            const payload = {
                pubId: this.pubId,
            };            
            this.$http.post(`${defines.SERVER_URL}${defines.PUBLISH_LIKE_URL}`, payload)
            .then(
                (success) => {
                    this.$emit("uptLike", success.body.postLike);
                },
                (/*failed*/) => {

                },
            );
        },
        dislike() {
            const payload = {
                pubId: this.pubId,
            };            
            this.$http.post(`${defines.SERVER_URL}${defines.PUBLISH_DISLIKE_URL}`, payload)
            .then(
                (success) => {
                    this.$emit("uptDislike", success.body.postDislike);
                },
                (/*failed*/) => {

                },
            );

        },
    }
}
</script>
