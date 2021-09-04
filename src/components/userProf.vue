<template>
    <v-card
    :color="darkMode? '': ''" 
    :dark='darkMode'
    >
        <!--toolbar-title-->
        <v-toolbar 
        height="65px"
        :color="darkMode? '': 'primary'" 
        :dark='darkMode'
        style="position: sticky; top:0px; z-index:1;" 
        class="d-flex justify-center title px-1"
        >
            <v-toolbar-title>Profil de {{ item.pseudo }}</v-toolbar-title>
        </v-toolbar>
        <div
        style="position: sticky; top: 65px; z-index: 1;"
        >
            <!--menu-->
            <v-menu>
                <!--menu-activator-template-->
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        v-bind="attrs"
                        v-on="on"
                        text
                        plain
                    >
                    <v-icon>mdi-menu</v-icon>
                    </v-btn>
                </template>
                <!--menu-list-default-template-->
                <template>
                    <v-list 
                        :color="darkMode? '': 'white'" 
                        :dark='darkMode'
                    >
                        <v-list-item @click="dialog.value = false">
                            <v-list-item-title>Fermer</v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="checkMenuSU(item)" @click="authSuperUser(item)">
                            <v-list-item-title> {{ item.rights == "basic"?"Activer admin":"Activer basique" }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="checkMenuSU(item)" @click="userPass(item)">
                            <v-list-item-title> {{ item.locked? "Débloquer utilisateur":"Bloquer utilisateur" }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </template>
            </v-menu>
        </div>
        
        <!--card-content-->
        <v-card-text class="px-0">
            <v-container grid-list-xs>
                <!--user-img-row-->
                <v-row class="justify-center">
                    <v-col class="d-flex flex-grow-0">
                        <avatar :item="item" :size=100></avatar>
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
                        <v-col v-if="checkMenuSU(item)">
                            <div class="text-center text-h6">Type de compte</div>
                            <v-card-text class="text-center">{{ item.rights }}</v-card-text>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col v-if="checkMenuSU(item)">
                            <div class="text-center text-h6">Status</div>
                            <v-card-text class="text-center">{{ item.locked? 'Bloqué': 'Débloqué' }}</v-card-text>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="px-0">
                            <!--profil-publication-card-->
                            <div class="text-center text-h6">Dernières publications</div>
                            <v-card-text v-if="undefined == publications.find(pub => pub.authorId == item.userId)" class="text-center">{{ item.pseudo }} n'a pas encore de publication</v-card-text>
                            <div v-for="pub in publications" :key="pub.pubId">
                                <v-card-text v-if="item.userId == pub.authorId" style="z-index: 3;">
                                    <pubcard
                                    style="z-index: 3;"
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
                            </div>
                        </v-col>
                    </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import pubcard from "../components/pubcard.vue"
import avatar from "../components/avatar.vue"
export default {
    name: "userProf",
    components: {
        pubcard,
        avatar,
    },
    props: {
        dialog: Object,
        item: Object,
    },
    computed: {
        ...mapState([
            "publications",
            "userData",
            "darkMode",
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
            "superUser",
            "revokeSuperUser",
            "lockUser",
            "unlockUser",
        ]),
        authSuperUser(item) {
            if(item.rights == "basic") {
                this.superUser(item.userId)
                .then( () => {
                    this.$emit('refresh');
                })
                .catch();
            }
            else {
                this.revokeSuperUser(item.userId)
                .then( () => {
                    this.$emit('refresh');
                })
                .catch();
            }
        },
        userPass(item) {
            // function is used to set 
            // locked or unlocked account user
            if(item.locked) {
                this.unlockUser(item.userId)
                .then( () => {
                    this.$emit('refresh');
                })
                .catch();
            }
            else {
                this.lockUser(item.userId)
                .then( () => {
                    this.$emit('refresh');
                })
                .catch();
            }
        },
        checkMenuSU(item) {
            // this function is used to check user rights 
            // and show or not show features if user doesn't have super account
            return this.userData.rights == 'super' && this.userData.userId != item.userId;
        },
        onClick () {
        // Perform an action
        },
    },
    created() {
    }
}
</script>

