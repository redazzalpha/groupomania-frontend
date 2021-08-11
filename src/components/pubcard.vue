<template>
    <div class="pubCard">
        <!--Publications-cards-->
        <div v-if="publications.length <= 0" class="title text-center">Il n'y a pas encore de publication soyez le premier à en créer une !</div>
        <v-card
        v-for="item in publications"
        :key="item.pubId"
        max-width=550 
        class="ma-auto mt-8" 
        elevation="15" 
        color="grey lighten-1" 
        outlined 
        shaped
        >
            <v-container >
                <!--title-row-->
                <v-row no-gutters>
                    <v-col class="flex-grow-0">
                        <v-avatar size=60>
                            <v-img v-if="item.img != 'null'" :src="item.img" width=50% />
                            <v-icon v-else size=65 >mdi-account-circle</v-icon>
                        </v-avatar>
                    </v-col>
                    <v-col>
                        <v-container class="pa-0 pl-1">
                            <v-row no-gutters class="subtitle-1 blue--text text--darken-4">
                                <v-col>{{ item.pseudo }}</v-col>
                                <v-col class="text-right" v-show="item.userId == userId">
                                    <v-btn
                                    icon 
                                    color="red darken-3"
                                    title="Supprimer la publication"
                                    @click="delPub(item.pubId)"
                                    >
                                        <v-icon>mdi-close-circle</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row no-gutters class="body-2 font-italic">
                                <v-col>publié le {{ item.time.substring(0,20) }}</v-col>
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
                        <v-card-text class="subtitle-1">{{ item.text }}</v-card-text>
                    </v-col>
                </v-row>
                <!--horizontal-line-separation-->
                <v-row><v-divider></v-divider></v-row>
                <!--like-dislike-row-->
                <v-row>
                    <v-col class="pr-0 pl-0">
                        <v-btn 
                        width="100%"
                        title="J'aime" 
                        @click="like({pubId: item.pubId, userIdLike: item.userIdLike, userIdDislike: item.userIdDislike})"
                        >
                            <v-icon :color='item.userIdLike && item.userIdLike.find(item => item == userId) ? "green": ""'>mdi-thumb-up</v-icon> {{ item.postLike }}
                        </v-btn>
                    </v-col>
                    <v-col class="pr-0 pl-0">
                        <v-btn 
                        width="100%"
                        title="Je n'aime pas" 
                        @click="dislike({pubId: item.pubId, userIdDislike: item.userIdDislike, userIdLike: item.userIdLike})"
                        >
                            <v-icon :color='item.userIdDislike && item.userIdDislike.find(item => item == userId) ? "red": ""'>mdi-thumb-down</v-icon> {{ item.postDislike }}
                        </v-btn>
                    </v-col>
                </v-row>
                <!--comments-row-->
                <v-row v-if="comments.length >= 1">
                    <v-col class="text-decoration-underline">
                        Commentaires:
                    </v-col>
                </v-row>
                <comment
                :userId="userId"
                :pubId="item.pubId"
                :comments="comments"                
                @delCom="delCom"
                ></comment>
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
                                    <v-btn title="Envoyer" icon size=40 color="primary" @click="comment({pubId: item.pubId, comText})"><v-icon>mdi-send</v-icon></v-btn>
                                </template>
                            </v-textarea>
                        </v-row>
                    </v-card-text>
                </v-row>
            </v-container>
        </v-card>
    </div>
</template>

<script>
import comment from "../components/comment.vue";
export default {
    name: "pubcard",
    components: {
        comment,
    },
    props: {
        userId: Number,
        userPseudo: String,
        userImg: String,
        publications: Array,
        comments: Array,
    },
    data() {
        return {
            comText: "",
            color: ""
        };
    },
    methods: {
        comment(data) {
            this.$emit("comment", data);
            this.comText = "";
        },
        delPub(pubId) {
            this.$emit("delPub", pubId);
        },
        delCom(data) {
            this.$emit("delCom", data);
        },
        like(data) {

            const userIdLike = data.userIdLike;
            const userIdDislike = data.userIdDislike;
            
            if(userIdLike == null && userIdDislike == null) {
                this.$emit("like", data);
            }
            else if(userIdLike && userIdDislike == null) {
                if(userIdLike && !userIdLike.find(item => item == this.userId))
                    this.$emit("like", data);
                else if(userIdLike && userIdLike.find(item => item == this.userId))
                    this.$emit("unlike", data);
            }
            else if(userIdLike == null && userIdDislike) {
                (userIdDislike && !userIdDislike.find(item => item == this.userId)) ?
                this.$emit("like", data) : "";
            }
            else if(userIdLike && userIdDislike) {
                if((userIdLike && !userIdLike.find(item => item == this.userId)) && (userIdDislike && !userIdDislike.find(item => item == this.userId)))
                    this.$emit("like", data);
    
                else if((userIdLike && userIdLike.find(item => item == this.userId)) && (userIdDislike && !userIdDislike.find(item => item == this.userId)))
                    this.$emit("unlike", data);
            }
        },
        dislike(data) {
            const userIdLike = data.userIdLike;
            const userIdDislike = data.userIdDislike;

            if(userIdDislike == null && userIdLike == null) {
                this.$emit("dislike", data);
            }
            else if(userIdDislike && userIdLike == null) {
                if(userIdDislike && !userIdDislike.find(item => item == this.userId))
                    this.$emit("dislike", data);
                else if(userIdDislike && userIdDislike.find(item => item == this.userId))
                    this.$emit("undislike", data);
            }
            else if(userIdDislike == null && userIdLike) {
                (userIdLike && !userIdLike.find(item => item == this.userId)) ?
                this.$emit("dislike", data) : "";
            }
            else if(userIdDislike && userIdLike) {
                if((userIdDislike && !userIdDislike.find(item => item == this.userId)) && (userIdLike && !userIdLike.find(item => item == this.userId)))
                    this.$emit("dislike", data);
    
                else if((userIdDislike && userIdDislike.find(item => item == this.userId)) && (userIdLike && !userIdLike.find(item => item == this.userId)))
                    this.$emit("undislike", data);
            }
        },
    },
}
</script>
