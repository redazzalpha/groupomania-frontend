<template>
    <!--Publications-cards-->
    <v-card max-width=550 class="ma-auto mt-8" elevation="15" outlined  color="grey lighten-3">
        <v-container>
            <!--title-row-->
            <v-row>
                <v-card-title>
                    <v-row class="d-flex">
                        <v-col  cols=3 >
                            <v-avatar size=60><v-img src="../assets/malcomZ.jpg"  /></v-avatar>
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
                        <v-textarea background-color="white" placeholder="Votre commentaire" solo rounded rows="1" full-width outlined no-resize>
                            <template v-slot:prepend>
                                <v-avatar size=40><img src="../assets/user_wolf.jpg" /></v-avatar>
                            </template>
                            <template v-slot:append>
                                <v-btn title="Envoyer" icon size=40 color="primary" ><v-icon>mdi-send</v-icon></v-btn>
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
        authorImgUrl: String,
        authorName: String,
        authorPub: String,
        userImgUrl: String,
        likeCount: String,
        dislikeCount: String,
    }

}
</script>
