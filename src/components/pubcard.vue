<template>
    <div class="pubCard">
        <!--Publications-cards-->
        <v-card
        max-width=550 
        class="mx-auto mt-8" 
        elevation="15" 
        color="grey lighten-2" 
        outlined 
        shaped
        >
            <v-container >
                <!--title-row-->
                <v-row no-gutters>
                    <v-col class="flex-grow-0">
                        <avatar :item="item" :size=65></avatar>
                    </v-col>
                    <v-col>
                        <v-container class="pa-0 pl-1">
                            <v-row no-gutters class="subtitle-1 blue--text text--darken-4">
                                <v-col>{{ item.pseudo }}</v-col>
                                <v-col class="text-right" v-show="item.userId == userData.userId || userData.rights == 'super'">
                                    <v-btn
                                    icon 
                                    color="grey lighten-1"
                                    title="Supprimer la publication"
                                    style="position: absolute; right: 0px; top: 5px"
                                    :loading="loading4"
                                    :disabled="loading4"
                                    @click="deletePub(item.pubId)"
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
                    <v-col class="test">
                        <ckeditor :disabled="true" :editor="editor" :value="geditorData(item.text)" :config="editorConfig"></ckeditor> 
                    </v-col>
                </v-row>
                <!--horizontal-line-separation-->
                <v-row><v-divider></v-divider></v-row>
                <!--like-dislike-row-->
                <v-row>
                    <v-col class="px-0 text-center">
                        <v-btn 
                        plain icon
                        title="J'aime"
                        :loading="loading" 
                        :disabled="loading" 
                        @click="postLike({pubId: item.pubId, userIdLike: item.userIdLike, userIdDislike: item.userIdDislike})"
                        >
                            <v-icon :color='item.userIdLike && item.userIdLike.find(item => item == userData.userId) ? "green": ""'>mdi-thumb-up</v-icon> {{ item.postLike }}
                        </v-btn>
                    </v-col>
                    <v-col class="px-0 text-center" >
                        <v-btn 
                        plain icon
                        title="Je n'aime pas" 
                        :loading="loading2" 
                        :disabled="loading2" 
                        @click="postDislike({pubId: item.pubId, userIdDislike: item.userIdDislike, userIdLike: item.userIdLike})"
                        >
                            <v-icon
                            :color='item.userIdDislike && item.userIdDislike.find(item => item == userData.userId) ? "red": ""'>mdi-thumb-down</v-icon> {{ item.postDislike }}
                        </v-btn>
                    </v-col>
                </v-row>
                <comment
                :pubId="item.pubId"
                ></comment>
                <!--add-comment-row-->
                <v-row>
                    <v-card-text>
                        <v-row>
                            <v-textarea 
                            v-model="comText" 
                            background-color="white" 
                            placeholder="Votre commentaire" 
                            solo 
                            rounded 
                            rows="1" 
                            auto-grow 
                            full-width 
                            outlined 
                            no-resize
                            counter
                            :rules="rules"
                            >

                                <template v-slot:prepend>
                                    <avatar :item="userData" :size=45></avatar>
                                </template>
                                <template v-slot:append>
                                    <v-btn 
                                    title="Envoyer" 
                                    icon size=40 
                                    color="primary" 
                                    :loading="loading3"
                                    :disabled="loading3"
                                    @click="postCom({authorId: item.authorId, parentId: item.pubId, comText})"
                                    >
                                        <v-icon>mdi-send</v-icon>
                                    </v-btn>
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
import { mapState, mapActions } from 'vuex';
import defines from "../defines/define";
import services from '../services/app.service';
import comment from "../components/comment.vue";
import avatar from "../components/avatar.vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
    name: "pubcard",
    components: {
        comment,
        avatar,
    },
    props: {
        item: Object,
    },
    data() {
        return {
            editor: ClassicEditor,
            editorData: '',
            editorConfig: {
                toolbar: [],
            },
            geditorData(text) {
                return  this.editorData = text;
            },

            comText: "",
            color: "",
            loading: false,
            loading2: false,
            loading3: false,
            loading4: false,
            rules: [
                services.max255,
            ],
        };
    },
    computed: {
        ...mapState(["userData", "publications"]),
        gpubLength() {
            return this.publications.length <= 0;
        }
    },
    methods: {
        ...mapActions([
            "delPub",
            "comment",
            "like",
            "unlike",
            "dislike",
            "undislike",
        ]),
        postCom(data) {
            this.comment(data);
            this.comText = "";
        },
        postLike(data) {

            this.loading = true;
            const userIdLike = data.userIdLike;
            const userIdDislike = data.userIdDislike;
            
            if(userIdLike == null && userIdDislike == null) {
                this.like(data);
            }
            else if(userIdLike && userIdDislike == null) {
                if(userIdLike && !userIdLike.find(item => item == this.userData.userId))
                this.like(data);
                else if(userIdLike && userIdLike.find(item => item == this.userData.userId))
                this.unlike(data);
            }
            else if(userIdLike == null && userIdDislike) {
                (userIdDislike && !userIdDislike.find(item => item == this.userData.userId)) ?
                this.$emit("like", data) : "";
            }
            else if(userIdLike && userIdDislike) {
                if((userIdLike && !userIdLike.find(item => item == this.userData.userId)) && (userIdDislike && !userIdDislike.find(item => item == this.userData.userId)))
                this.like(data);
    
                else if((userIdLike && userIdLike.find(item => item == this.userData.userId)) && (userIdDislike && !userIdDislike.find(item => item == this.userData.userId)))
                this.unlike(data);
            }

            setTimeout(() => {this.loading = false}, defines.TIMEOUT);
        },
        postDislike(data) {
            this.loading2 = true;
            const userIdLike = data.userIdLike;
            const userIdDislike = data.userIdDislike;

            if(userIdDislike == null && userIdLike == null) {
                this.dislike(data);
            }
            else if(userIdDislike && userIdLike == null) {
                if(userIdDislike && !userIdDislike.find(item => item == this.userData.userId))
                this.dislike(data);
                else if(userIdDislike && userIdDislike.find(item => item == this.userData.userId))
                this.undislike(data);
            }
            else if(userIdDislike == null && userIdLike) {
                (userIdLike && !userIdLike.find(item => item == this.userData.userId)) ?
                this.dislike(data) : "";
            }
            else if(userIdDislike && userIdLike) {
                if((userIdDislike && !userIdDislike.find(item => item == this.userData.userId)) && (userIdLike && !userIdLike.find(item => item == this.userData.userId)))
                this.dislike(data);
    
                else if((userIdDislike && userIdDislike.find(item => item == this.userData.userId)) && (userIdLike && !userIdLike.find(item => item == this.userData.userId)))
                this.undislike(data);
            }

            setTimeout(() => {this.loading2 = false}, defines.TIMEOUT);
        },
        deletePub(pubId) {
            this.loading4 = true;
            this.delPub(pubId),
            setTimeout(() => { this.loading4 = false }, defines.TIMEOUT);
        },

    },
}
</script>

<style lang="scss">
.v-btn--plain:not(.v-btn--active):not(.v-btn--loading):not(:focus):not(:hover) .v-btn__content {
    opacity: 1;
}
</style>