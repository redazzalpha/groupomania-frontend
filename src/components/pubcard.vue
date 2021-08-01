<template>
    <!--Publications-cards-->
    <v-card max-width=550 class="ma-auto mt-8" elevation="15" outlined  color="grey lighten-1" shaped>
        <v-container>
            <!--title-row-->
            <v-row>
                <v-card-title>
                    <v-row class="d-flex">
                        <v-col  cols=4 >
                            <v-avatar size=60>
                                <v-img v-if="authorImgName != 'null'" :src="authorImg"/>
                                <v-icon v-else size=65 color="gey">mdi-account-circle</v-icon>
                            </v-avatar>
                        </v-col>
                        <v-col >
                            <v-card-text>{{ authorName }}</v-card-text>
                        </v-col>
                    </v-row>
                </v-card-title>
            </v-row>
            <!--horizontal-line-separation-->
            <v-row><v-divider></v-divider></v-row>
            <!--publication-row-->
            <v-row>
                <v-col>
                    <v-card-text class="ml-5" >{{ authorPub }}</v-card-text>
                </v-col>
            </v-row>
            <!--horizontal-line-separation-->
            <v-row><v-divider></v-divider></v-row>
            <!--like-dislike-row-->
            <v-row>
                <v-col class="pr-0 pl-0">
                    <v-btn width="100%" title="J'aime">
                        <v-icon>mdi-thumb-up</v-icon> {{ likeCount }}
                    </v-btn>
                </v-col>
                <v-col class="pr-0 pl-0">
                    <v-btn width="100%" title="Je n'aime pas">
                        <v-icon>mdi-thumb-down</v-icon> {{ dislikeCount }}
                    </v-btn>
                </v-col>
            </v-row>
            <!--comments-row-->
            <v-row></v-row>
            <!--add-comment-row-->
            <v-row>
                <v-card-text>   
                    <v-row>
                        <v-textarea v-model="comText" background-color="white" placeholder="Votre commentaire" solo rounded rows="1" full-width outlined no-resize>
                            <template v-slot:prepend>
                                <v-avatar size=40>
                                    <v-img v-if="userImgName" :src="userImgName"  />
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
export default {
    name: "pubcard",
    props: {
        userImgName: String,
        authorImgName: String,
        authorName: String,
        authorPub: String,
        likeCount: Number,
        dislikeCount: Number,
        pubId: Number,
    },
    data() {
        return {
            comText: "",
        };
    },
    computed: {
        authorImg: function () {
            if(this.authorImgName != "null") {
                let images = require.context('../assets', false, /\.png$|\.jpg$|\.jpeg$/)
                return images(`./${this.authorImgName}`);
            }
            return null;
        },
        
    },
    methods: {
        comment() {

            this.$emit("comment", {pubId: this.pubId, comText: this.comText});
            this.comText = "";
        }
    }
}
</script>
