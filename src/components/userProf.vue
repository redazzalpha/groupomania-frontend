<template>
    <v-card>
        <!--toolbar-title-->
        <v-toolbar color="primary" dark class="d-flex justify-center title">
            Profil de {{ item.pseudo }}
        </v-toolbar>
        <!--card-content-->
        <v-card-text>
            <v-container grid-list-xs class="">
                <!--user-img-row-->
                <v-row class="justify-center">
                    <v-col class="d-flex flex-grow-0">
                        <v-avatar size="100" color="primary">
                            <v-img v-if="item.img" :src="item.img"  />
                            <v-icon v-else size= 50 color="white">mdi-account</v-icon>
                        </v-avatar>
                    </v-col>
                </v-row>
                <!--description-row-->
                <v-row class="d-flex flex-column">
                    <v-col>
                        <div class="text-center text-h6">Description</div>
                        <v-card-text v-if="item.description" class="text-center">{{ item.description }}</v-card-text>
                        <v-card-text v-else class="text-center">{{ item.pseudo }} n'a pas encore de description</v-card-text>
                    </v-col>
                </v-row>
                    <v-row>
                        <v-col>
                            <div class="text-center text-h6">Type de compte</div>
                            <v-card-text class="text-center">{{ item.rights }}</v-card-text>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <!--profil-publication-card-->
                            <div class="text-center text-h6">Dernières publications</div>
                            <v-card-text v-if="undefined == publications.find(pub => pub.authorId == item.userId)" class="text-center">{{ item.pseudo }} n'a pas encore de publication</v-card-text>
                            <v-card-text v-for="pub in publications" :key="pub.pubId">
                                <pubcard
                                v-if="item.userId == pub.authorId"
                                :item="pub"
                                @comment="comment"
                                @delPub="delPub"
                                @delCom="delCom"
                                @like="like"
                                @dislike="dislike"
                                @unlike="unlike"
                                @undislike="undislike"
                                @refresh="refresh"
                                ></pubcard>
                            </v-card-text>
                        </v-col>
                    </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
            <v-btn 
            text
            @click="dialog.value = false"
            >
                <v-icon>mdi-close</v-icon> fermer
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import pubcard from "../components/pubcard.vue"
export default {
    name: "userProf",
    components: {
        pubcard,
    },
    props: {
        dialog: Object,
        item: Object,
    },
    computed: {
        ...mapState([
            "publications"
        ]),
    },
    methods: {
        ...mapActions([
            "comment",
            "delPub",
            "delCom",
            "like",
            "dislike",
            "unlike",
            "undislike",
            "refresh",
        ]),
    },

}
</script>

