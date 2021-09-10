<template>
    <v-lazy
    v-model="isActive"
    :options="{ threshold: .9}"
    transition="fade-transition"
    class="pubCard"
    >
        <!--Publications-cards-->
        <v-card
        max-width=550 
        class="mx-auto mt-8" 
        elevation="15" 
        :color="darkMode? '': 'grey lighten-2'" 
        :dark='darkMode'
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
                                    :color="darkMode? '': 'grey lighten-1'" 
                                    :dark='darkMode'
                                    title="Supprimer la publication"
                                    style="position: absolute; right: 0px; top: 5px"
                                    tag="button"
                                    :loading="loading3"
                                    :disabled="loading3"
                                    @click="deletePub(item.pubId)"
                                    >
                                        <v-icon>mdi-close-circle</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row no-gutters class="body-2 font-italic" >
                                <v-col>publié le {{ item.time }}</v-col>
                            </v-row>
                        </v-container>
                    </v-col>
                </v-row>
                <!--horizontal-line-separation-->
                <v-row><v-divider></v-divider></v-row>
                <!--publication-row-->
                <v-row>
                    <v-col class="test">
                        <ckeditor tag="textarea" :disabled="true" :editor="editor" :value="geditorData(item.text)" :config="editorConfig"></ckeditor> 
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
                        tag="button"
                        :loading="loading" 
                        :disabled="loading" 
                        @click="postLike( { usedArray, item } )"
                        >
                            <v-icon :color='item.userIdLike && item.userIdLike.find(item => item == userData.userId) ? "green": ""'>mdi-thumb-up</v-icon> {{ item.postLike }}
                        </v-btn>
                    </v-col>
                    <v-col class="px-0 text-center" >
                        <v-btn 
                        plain icon
                        title="Je n'aime pas" 
                        tag="button"
                        :loading="loading" 
                        :disabled="loading" 
                        @click="postDislike({ usedArray, item })"
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
                            solo 
                            rounded 
                            auto-grow 
                            full-width 
                            outlined 
                            no-resize
                            counter
                            rows="1" 
                            :background-color="darkMode?'grey darken-4':'white'" 
                            placeholder="Votre commentaire"
                            tag="textarea"
                            :rules="rules"
                            >
                                <template v-slot:prepend>
                                    <avatar :item="userData" :size=45></avatar>
                                </template>
                                <template v-slot:append>
                                    <v-btn 
                                    title="Envoyer" 
                                    icon size=40 
                                    :color="darkMode? '': 'blue'" 
                                    :dark='darkMode'
                                    tag="button"
                                    :loading="loading2"
                                    :disabled="loading2"
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
    </v-lazy>
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
        usedArray: Array,
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
            rules: [
                services.max255,
            ],
            isActive: false,
        };
    },
    computed: {
        ...mapState([
            "userData",
            "publications",
            "darkMode",
        ]),
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
            const userIdLike = data.item.userIdLike;
            const userIdDislike = data.item.userIdDislike;

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
                this.like(data) : "";
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
            this.loading = true;
            const userIdLike = data.item.userIdLike;
            const userIdDislike = data.item.userIdDislike;

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
            setTimeout(() => {this.loading = false}, defines.TIMEOUT);
        },
        deletePub(pubId) {
            this.loading3 = true;
            this.delPub(pubId),
            setTimeout(() => { this.loading3 = false }, defines.TIMEOUT);
        },

    },
}
</script>

<style lang="scss">
.v-btn--plain:not(.v-btn--active):not(.v-btn--loading):not(:focus):not(:hover) .v-btn__content {
    opacity: 1;
}
</style>