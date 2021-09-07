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
                            <v-card-text v-if="undefined == pubs.find(pub => pub.authorId == item.userId)" class="text-center">{{ item.pseudo }} n'a pas encore de publication</v-card-text>
                            <div v-for="pub in pubs" :key="pub.pubId">
                                <v-card-text v-if="item.userId == pub.authorId" style="z-index: 3;">
                                    <pubcard
                                    style="z-index: 3;"
                                    :item="pub"
                                    :usedArray="pubs"
                                    ></pubcard>
                                </v-card-text>
                            </div>
                        </v-col>
                    </v-row>
            </v-container>
        </v-card-text>
        <!--alert-modification-message-->
        <alert
        :text='alertText'
        :watcher='alertWatcher'
        :type='alertType'
        @clickOut='closeAlert'
        ></alert>
    </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import pubcard from "../components/pubcard.vue"
import avatar from "../components/avatar.vue"
import alert from "../components/alert.vue"
export default {
    name: "userProf",
    components: {
        pubcard,
        avatar,
        alert,
    },
    props: {
        dialog: Object,
        item: Object,
    },
    data() {
        return {
            alertWatcher: false,
            alertText: '',
            alertType: '',
            pubs: [],
        };
    },
    computed: {
        ...mapState([
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
            "getUserPubs",
        ]),
        async authSuperUser(item) {
            // this function is used 
            // to set grant access or revoke 
            //  to user
            try {
                if(item.rights == "basic") {
                    await this.superUser(item.userId)
                    this.alertText = `${item.pseudo} est désormais administrateur`;
                    this.alertType = 'success';
                    this.$emit('refresh');
                }
                else {
                    await this.revokeSuperUser(item.userId)
                    this.alertText = `${item.pseudo} n'est plus  administrateur`;
                    this.alertType = 'success';
                    this.$emit('refresh');
                }
            }
            catch(e) {
                this.alertText = 'Une erreur s\'est produite veuillez réessayer ultérieurement';
                this.alertType = 'error';
            }
            finally {
                this.alertWatcher = true;
            }
        },
        async userPass(item) {
            // function is used to set 
            // locked or unlocked account user
            try {
                if(item.locked) {
                    await this.unlockUser(item.userId)
                    this.alertText = `Le compte de ${item.pseudo} a été débloqué avec succès`;
                    this.alertType = 'success';
                    this.$emit('refresh');
                }
                else {
                    await this.lockUser(item.userId)
                    this.alertText = `Le compte de ${item.pseudo} a été bloqué avec succès`;
                    this.alertType = 'success';
                    this.$emit('refresh');
                }
            }
            catch(e) {
                this.alertText = 'Une erreur s\'est produite veuillez réessayer ultérieurement';
                this.alertType = 'error';
            }
            finally {
                this.alertWatcher = true;
            }
        },
        checkMenuSU(item) {
            // this function is used to check user rights 
            // and show or not show features if user doesn't have super account
            return this.userData.rights == 'super' && this.userData.userId != item.userId;
        },
        async getPubs () {
            this.pubs = await this.getUserPubs(this.item.userId);
            this.pubs = this.pubs.body.results;
        },
        closeAlert() {
            this.alertWatcher = false;
        },
    },
    created() {
        this.getPubs();
    }
}
</script>

