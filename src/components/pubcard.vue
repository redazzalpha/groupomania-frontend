<template>
    <!--Publications-cards-->
    <v-card max-width=550 class="ma-auto mt-8" elevation="15" outlined color="grey lighten-1" shaped>
        <v-container >
            <!--title-row-->
            <v-row no-gutters>
                <v-col class="flex-grow-0">
                    <v-avatar size=60>
                        <v-img v-if="authorImg != 'null'" :src="authorImg" width=50% />
                        <v-icon v-else size=65 >mdi-account-circle</v-icon>
                    </v-avatar>
                </v-col>
                <v-col>
                    <v-container class="pa-0 pl-1">
                        <v-row no-gutters class="subtitle-1 blue--text text--darken-4">
                                <v-col>{{ authorName }}</v-col>
                        </v-row>
                        <v-row no-gutters class="body-2 font-italic">
                                <v-col>publié le {{ time }}</v-col>
                            </v-row>
                    </v-container>
                </v-col>
            </v-row>
            <!--horizontal-line-separation-->
            <v-row><v-divider></v-divider></v-row>
            <!--publication-row-->
            <v-row>
                <v-col>
                    <v-card-text class="ml-5" >{{ text }}</v-card-text>
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
            <v-row v-if="comments.length >= 1">
                <v-col class="text-decoration-underline">
                    Commentaires:
                </v-col>
            </v-row>
            <!--comments-row-->
            <v-row v-for="item in comments" :key="item.comId">
                <v-col v-if="item.pubId == pubId" class="flex-grow-0 d-flex align-center pr-0">
                    <v-avatar size=40>
                        <v-img v-if="item.img" :src="item.img"  />
                        <v-icon v-else size=40>mdi-account-circle</v-icon>
                    </v-avatar>
                </v-col>
                <v-col v-if="item.pubId == pubId">
                    <v-container class="body-2 pl-3">
                        <v-row>
                            <v-col class="text-decoration-underline flex-grow-0 pa-0">{{ item.pseudo}}</v-col>
                            <v-col class="font-italic pa-0 pl-2">le {{ item.time}}</v-col>
                        </v-row>
                        <v-row >
                            <v-col class="pa-0">{{ item.text}}</v-col>
                        </v-row>
                    </v-container>
                </v-col>
            </v-row>
            <!--add-comment-row-->
            <v-row>
                <v-card-text>   
                    <v-row>
                        <v-textarea v-model="comText" background-color="white" placeholder="Votre commentaire" solo rounded rows="1" full-width outlined no-resize>
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
export default {
    name: "pubcard",
    props: {
        userImg: String,
        authorImg: String,
        authorName: String,
        text: String,
        time: String,
        likeCount: Number,
        dislikeCount: Number,
        pubId: Number,
        comments: Array,
    },
    data() {
        return {
            comText: "",
        };
    },
    methods: {
        comment() {

            this.$emit("comment", {pubId: this.pubId, comText: this.comText});
            this.comText = "";
        }
    }
}
</script>
