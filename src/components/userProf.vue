<template>
    <v-card
    ref='card'
    :color="darkMode? '': ''" 
    :dark='darkMode'
    v-scroll.self='onScroll'
    style='max-height: 685px;'
    class="overflow-y-auto"
    v-observe-visibility="observer"
    :style='"background: url(" + (darkMode? require("../assets/bg-dark.jpg") : require("../assets/bg-light.jpg")) + ") no-repeat fixed center; background-size: 100vw 100vh !important"'
    >
        <!--toolbar-title-->
        <v-toolbar 
        height="65px"
        :color="darkMode? '': 'primary'" 
        :dark='darkMode'
        style="position: sticky; top:0px; z-index: 2;" 
        class="d-flex justify-center title px-1"
        >
            <v-toolbar-title>Profil de {{ item.pseudo }}</v-toolbar-title>
        </v-toolbar>
        <!--menu-block-->
        <div style="position: sticky; top: 65px; z-index: 1;">
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
                        <v-list-item v-if="checkMenuSU(item)" @click="authSuper(item)">
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
        <v-card-text class="px-0" >
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
                <!--account-type-row-->
                <v-row>
                    <v-col v-if="checkMenuSU(item)">
                        <div class="text-center text-h6">Type de compte</div>
                        <v-card-text class="text-center">{{ item.rights }}</v-card-text>
                    </v-col>
                </v-row>
                <!--account-status-row-->
                <v-row>
                    <v-col v-if="checkMenuSU(item)">
                        <div class="text-center text-h6">Status</div>
                        <v-card-text class="text-center">{{ item.locked? 'Bloqué': 'Débloqué' }}</v-card-text>
                    </v-col>
                </v-row>
                <!--publication-card -row-->
                <v-row>
                    <v-col class="px-0">
                        <div class="text-center text-h6">Dernières publications</div>
                        <v-card-text v-if="undefined == userPubs.find(pub => pub.authorId == item.userId)" class="text-center">{{ item.pseudo }} n'a pas encore de publication</v-card-text>
                        <div v-for="pub in userPubs" :key="pub.pubId">
                            <v-card-text v-if="item.userId == pub.authorId" style="z-index: 3;">
                                <pubcard
                                style="z-index: 3;"
                                :item="pub"
                                :usedArray="userPubs"
                                ></pubcard>
                            </v-card-text>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
            <!--end-pub-scroll-message-->  
            <v-alert 
            v-if='userPubs.length >= userPubCount && !(undefined == userPubs.find(pub => pub.authorId == item.userId))'
            class="text-center mt-8 mx-auto elevation-12"
            max-width=550 
            outlined
            text
            :color="darkMode? '' : 'primary'"
            :dark='darkMode'
            >Vous avez atteint la publication la plus ancienne
            </v-alert>
            <!--error-dial-->
        </v-card-text>
        <!--alert-modification-message-->
        <v-lazy
        v-model="isActive"
        :options="{ threshold: .9}"
        transition="fade-transition"
        >
            <alert
            :text='alertText'
            :icon='alertIcon'
            :watcher='alertWatcher'
            @clickOut='closeAlert'
            ></alert>
        </v-lazy>
        <!--scroll-top-button-->
        <v-btn
        v-show="fab"
        fab
        fixed
        bottom
        right                                                                                                                                                                                                                                                                                                                                                       
        :color='darkMode? "" : "primary"'
        :dark='darkMode'
        tab="button"
        @click="toTop"
        >
            <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
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
            alertText: '',
            alertIcon: '',
            alertWatcher: false,
            fab: false,
            isActive: false,
            pubs: [],
        };
    },
    computed: {
        ...mapState([
            "userData",
            "userPubs",
            "userPubCount",
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
            "superUser",
            "revokeSuperUser",
            "lockUser",
            "unlockUser",
            "getUserPubs",
            "userPubScroll",
        ]),
        async authSuper(item) {
            // this function is used 
            // to set grant access or revoke 
            //  to user
            try {
                if(item.rights == "basic") {
                    await this.superUser(item.userId)
                    this.alertText = `${item.pseudo} est désormais administrateur`;
                    this.alertIcon = 'mdi-check-circle';
                    this.$emit('refresh');
                }
                else {
                    await this.revokeSuperUser(item.userId)
                    this.alertText = `${item.pseudo} n'est plus  administrateur`;
                    this.alertIcon = 'mdi-check-circle';
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
                    this.alertIcon = 'mdi-lock-open'
                    this.$emit('refresh');
                }
                else {
                    await this.lockUser(item.userId)
                    this.alertText = `Le compte de ${item.pseudo} a été bloqué avec succès`;
                    this.alertIcon = 'mdi-lock'
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
            await this.getUserPubs(this.item.userId);
        },
        observer(isVisible) {
            if(isVisible) 
                this.getUserPubs(this.item.userId);
        },
        closeAlert() {
            this.alertWatcher = false;
        },
        onScroll(e) {
            // show button scroll top
            const onBottom  = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
            if(e.target.scrollTop >= 160)
                this.fab = true;
            else
                this.fab = false;
            // intinite scroll user publications
            if(onBottom) {
                this.userPubScroll(this.item.userId);
            }
        },
        toTop () {
            this.$el.scrollTop = 0;
        },
    },
}
</script>

<style lang="scss" scoped>
.v-sheet.v-card:not(.v-sheet--outlined) {
    scroll-behavior: smooth;
}
</style>
