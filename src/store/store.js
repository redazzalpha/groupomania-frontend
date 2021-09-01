import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";
import services from '../services/app.service';
import defines from '../defines/define';
import { Utils  } from '../class';
const jwt = require('jsonwebtoken');

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userData: {},
        users: [],
        publications: [],
        comments: [],
        notifs: [],
        dialogErrText: "",
        dialogErr: false,
        success: false,
        progress: false,
        showWelcome: true,
    },
    mutations: {

        SET_DIAL_ERR(state, bool) {
            state.dialogErr = bool;
        },
        SET_USER_DATA(state, payload) {
            state.userData = payload;
        },
        SET_USERS(state, array) {
            state.users = array;
        },
        SET_PUBLICATIONS(state, payload) {
            state.publications = payload;
        },
        SET_COMMENTS(state, payload) {
            state.comments = payload;
        },
        SET_NOTIFS(state, payload) {
            state.notifs = payload;
        },
        SET_PROGRESS(state, bool) {
            state.progress = bool;
        },
        SET_SHOW_WELCOME(state, bool) {
            state.showWelcome = bool;
        },
    },
    actions: {
        access(context, authUrl) {
            // access function is used to access resources
            // this function should be used only by auth component
            // and register view
            return new Promise((resolve, reject) => {
                const utils = new Utils();
                utils.access(authUrl)
                    .then(success => {
                        context.state.progress = false;
                        resolve(success);
                    })
                    .catch(failed => {
                        context.state.progress = false;
                        reject(failed);
                    });
            });
        },
        login(context, data) {
            return new Promise((resolve, reject) => {
                Vue.http.post(`${defines.SERVER_URL}${defines.LOGIN_URL}`, data)
                    .then(
                        success => {
                            success.text()
                                .then(token => {
                                    localStorage.grpm_store = token;
                                    context.state.userData = jwt.decode(success.body.data.token);
                                    context.state.showWelcome = true;
                                    resolve();
                                });
                        },
                        failed => {
                            if (failed.body.error) {
                                switch (failed.body.error.code) {
                                    case "ER_UNK_USER":
                                        context.state.dialogErrText = "L’adresse email que vous avez saisie n’est associée à aucun un compte. Veuillez le vérifier et réessayer.";
                                        context.state.dialogErr = true;
                                        break;
                                    case "ER_INV_PASS":
                                        context.state.dialogErrText = "Le mot de passe que vous avez saisi est invalide";
                                        context.state.dialogErr = true;
                                        break;
                                    default:
                                        throw new Error("Unknown error");
                                }
                            }
                            reject(failed);
                        }
                    );
            });
        },
        register(context, data) {
            return new Promise((resolve, reject) => {

                Vue.http.post(`${defines.SERVER_URL}${defines.SIGNUP_URL}`, data)
                    .then(
                        (/*success*/) => {
                            context.dispatch("login", data)
                                .then(() => {
                                    resolve();
                                });
                        },
                        failed => {
                            switch (failed.body.error.code) {
                                case "ER_DUP_ENTRY":
                                    if (/.*pseudo.*/gi.test(failed.body.error.sqlMessage))
                                    context.state.dialogErrText = "Le pseudo que vous essayez de créer existe déjà.";
                                    else if (/.*email.*/gi.test(failed.body.error.sqlMessage))
                                        context.state.dialogErrText = "L'utilisateur que vous essayez de créer existe déjà.";
                                    else context.state.dialogErrText = "Erreur inconnue.";

                                    context.state.dialogErr = true;
                                    break;
                                default:
                                    throw new Error("Unknown error");
                            }
                            reject();
                        }
                    );
            });
        },
        async publish(context, editorData) {
            if (editorData && services.isNotEmpty(editorData)) {
                let pub = editorData.replace("\\", "/");
                pub = pub.replace("'", "\\'");
                const utils = new Utils();
                const result = await utils.post(`${defines.SERVER_URL}${defines.PUBLISH_URL}`, { publication: pub });
                context.dispatch("refresh");
                return result;
            }
            else {
                context.state.dialogErrText = "Vous ne pouvez pas créer de publication vide";
                context.state.dialogErr = true;
            }
        },
        async comment(context, data) {
            if (data.comText && services.isNotEmpty(data.comText)) {
                const payload = {
                    parentId: data.parentId,
                    comText: data.comText,
                    authorId: data.authorId,
                };
                const utils = new Utils();
                const result = await utils.post(`${defines.SERVER_URL}${defines.COMMENT_URL}`, payload);
                context.dispatch("refresh");
                return result;
            }
            // if comment is empty set error dialog
            else {
                context.state.dialogErrText = "Vous ne pouvez pas créer de commentaire vide";
                context.state.dialogErr = true;
            }
        },
        async getPubs(context) {
            const utils = new Utils();
            const result = await utils.get(`${defines.SERVER_URL}${defines.PUBLISH_URL}`);
            context.state.publications = result.body.results;
            return result;
        },
        async getComs(context) {
            const utils = new Utils();
            const result = await utils.get(`${defines.SERVER_URL}${defines.COMMENT_URL}`);
            context.state.comments = result.body.results;
            return result;
        },
        async getNotifs(context) {
            const utils = new Utils();
            const result = await utils.get(`${defines.SERVER_URL}${defines.NOTIFICATION_URL}`);
            const notifs = result.body.results.filter(item => item.whereId == context.state.userData.userId);
            context.state.notifs =  notifs;
            return result;
        },
        async readNotif(context, item) {
            if (item.state == "unread") {
                const utils = new Utils();
                const result = await utils.patch(`${defines.SERVER_URL}${defines.READ_NOTIFICATION_URL}`, { notifId: item.notifId });
                context.dispatch("refresh");
                return result;
            }
        },
        async like(context, data) {
            if (data.userIdLike)
                data.userIdLike.push(context.state.userData.userId);
            else data.userIdLike = [context.state.userData.userId];
            const payload = { data };

            const utils = new Utils();
            const result = await utils.post(`${defines.SERVER_URL}${defines.PUBLISH_LIKE_URL}`, payload);
            context.dispatch("refresh");
            return result;
        },
        async unlike(context, data) {
            data.userIdLike = data.userIdLike.filter(item => { return item != context.state.userData.userId; });
            const payload = { data };

            const utils = new Utils();
            const result = await utils.post(`${defines.SERVER_URL}${defines.PUBLISH_UNLIKE_URL}`, payload);
            context.dispatch("refresh");
            return result;
        },
        async dislike(context, data) {

            if (data.userIdDislike)
                data.userIdDislike.push(context.state.userData.userId);
            else data.userIdDislike = [context.state.userData.userId];
            const payload = { data };

            const utils = new Utils();
            const result = await utils.post(`${defines.SERVER_URL}${defines.PUBLISH_DISLIKE_URL}`, payload);
            context.dispatch("refresh");
            return result;
        },
        async undislike(context, data) {
            data.userIdDislike = data.userIdDislike.filter(item => { return item != context.state.userData.userId; });
            const payload = { data };

            const utils = new Utils();
            const result = await utils.post(`${defines.SERVER_URL}${defines.PUBLISH_UNDISLIKE_URL}`, payload);
            context.dispatch("refresh");
            return result;
        },
        async getUsers(context) {

            const utils = new Utils();
            const result = await utils.get(`${defines.SERVER_URL}${defines.USERS_URL}`);
            context.state.users = result.body.results;
            return result;

        },
        async delPub(context, pubId) {

            const utils = new Utils();
            const result = await utils.delete(`${defines.SERVER_URL}${defines.PUBLISH_DEL_URL}`, { params: { pubId } });
            context.dispatch("refresh");
            return result;
        },
        async delCom(context, data) {

            const utils = new Utils();
            const result = await utils.delete(`${defines.SERVER_URL}${defines.COMMENT_DEL_URL}`, { params: { comId: data.comId } });
            context.dispatch("refresh");
            return result;
        },
        async delNotif(context, notifId) {

            const utils = new Utils();
            const result = await utils.delete(`${defines.SERVER_URL}${defines.DEL_NOTIFICATION_URL}`, { params: { notifId } });
            context.dispatch("refresh");
            return result;
        },
        delAccount(context, id) {
            return new Promise((resolve, reject) => {

                const utils = new Utils();
                utils.delete(`${defines.SERVER_URL}${defines.DEL_ACCOUNT_URL}`, { params: { id } })
                    .then(success => {
                        context.dispatch("resetStore");
                        resolve(success);
                    })
                    .catch(failed => {
                        context.state.dialogErrText = "Une erreur inattendue s'est produite lors de la suppression de votre compte.\nVeuillez réessayer.";
                        context.state.dialogErr = true;
                        reject(failed);
                    });
            });
        },
        async readAll(context) {

            const utils = new Utils();
            const result = await utils.patch(`${defines.SERVER_URL}${defines.READ_ALL_URL}`, { notifId: context.state.notifs[0].notifId });
            context.dispatch("refresh");
            return result;
        },
        async deleteAll(context) {

            const utils = new Utils();
            const result = await utils.patch(`${defines.SERVER_URL}${defines.DELETE_ALL_URL}`, { notifId: context.state.notifs[0].notifId });
            context.dispatch("refresh");
            return result;
        },
        async superUser(context, id) {

            const utils = new Utils();
            const result = await utils.patch(`${defines.SERVER_URL}${defines.SUPER_USER_URL}`, { id });
            return result;
        },
        async revokeSuperUser(context, id) {

            const utils = new Utils();
            const result = await utils.patch(`${defines.SERVER_URL}${defines.REVOKE_SUPER_USER_URL}`, { id });
            return result;            
        },
        async lockUser(context, id) {
            const utils = new Utils();
            const result = await utils.patch(`${defines.SERVER_URL}${defines.LOCK_USER_URL}`, { id });
            return result;
        },
        async unlockUser(context, id) {
            const utils = new Utils();
            const result = await utils.patch(`${defines.SERVER_URL}${defines.UNLOCK_USER_URL}`, { id });
            return result;
        },
        async uptImgProf(context, file) {

            if (file) {
                const formData = new FormData();
                formData.append("image", file, file.name);
    
                const utils = new Utils();
                const result = await utils.post(`${defines.SERVER_URL}${defines.PROFIL_IMG_URL}`, formData);
                localStorage.grpm_store = JSON.stringify(result.body);
                return result.body.data.imgUrl;            
            }
        },
        async uptDescProf(context, desc) {

            const utils = new Utils();
            const result = await utils.patch(`${defines.SERVER_URL}${defines.PROFIL_DESC_URL}`, { desc });
            const token = await result.text();
            localStorage.grpm_store = token;
            return result;
        },
        uptPasswdProf(context, data) {
            return new Promise((resolve, reject) => {
                const utils = new Utils();
                utils.patch(`${defines.SERVER_URL}${defines.PASSWORD_URL}`, { old: data.passwd, new: data.passwdChange })
                    .then(() => {
                        context.state.success = true;
                        setTimeout(() => { context.state.success = false; }, defines.TIMEOUT * 2);
                        resolve();
                    })
                    .catch(() => {
                        context.state.dialogErrText = "Le mot de passe que vous avez saisi est incorrect";
                        context.state.dialogErr = true;
                        context.state.success = false;
                        reject();
                    }); 
            });
        },
        pubScroll(context) {
            window.onscroll = async () => {
                    if (context.state.publications) {
                    let size = context.state.publications ? context.state.publications.length : 0;
                    let lpubid = { id: size ? context.state.publications[size - 1].pubId : 0 };
                    let tab = [];
                    size = context.state.publications ? context.state.publications.length : 0;
                    lpubid = { id: size ? context.state.publications[size - 1].pubId : 0 };
                    tab = [];
        
                    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                        const utils = new Utils();
                        const result = await utils.get(`${defines.SERVER_URL}${defines.PUBLISH_SCROLL_URL}`, { params: { lpubid } });
                        tab = context.state.publications;
                        for (let item of result.body.results)
                            tab.push(item);
                        context.state.publication = tab;
                        return result;                        
                    }
                }
            };
        },
        refresh(context) {
            return new Promise((resolve, reject) => {
                context.state.progress = true;
                context.dispatch("getPubs")
                    .then( () => {
                        context.dispatch("getComs")
                            .then( () => {
                                context.dispatch("getNotifs")
                                    .then(() => {
                                        setTimeout(() => { context.state.progress = false; }, defines.TIMEOUT);
                                        //context.state.progress = false;
                                        resolve();
                                    })
                                    .catch(() => {
                                        setTimeout(() => { context.state.progress = false; }, defines.TIMEOUT);
                                        //context.state.progress = false;
                                        reject();
                                    });
                            })
                            .catch(() => setTimeout(() => { context.state.progress = false; }, defines.TIMEOUT) );
                    })
                    .catch(setTimeout(() => { context.state.progress = false; }, defines.TIMEOUT) );
            });
        },
        resetStore(context) {
            context.state.userData = {};
            context.state.publications = [];
            context.state.comments = [];
            context.state.notifs = [];
            context.state.dialogErrText = "";
            context.state.dialogErr = false;
            context.state.success = false;
            context.state.progress = false;
            context.state.showWelcome = false;
            localStorage.removeItem("vuex");
            localStorage.removeItem("grpm_store");
        },
        setDialErr(context, bool) {
            context.commit("SET_DIAL_ERR", bool);
        },
        setUserData(context, payload) {
            context.commit("SET_USER_DATA", payload);
        },
        setUsers(context, array) {
            context.commit("SET_USERS", array);
        },
        setPublications(context, payload) {
            context.commit("SET_PUBLICATIONS", payload);
        },
        setComments(context, payload) {
            context.commit("SET_COMMENTS", payload);
        },
        setNotifs(context, payload) {
            context.commit("SET_NOTIFS", payload);  
        },
        setProgress(context, bool) {
            context.commit('SET_PROGRESS', bool);
        },
        setShowWelcome(context, bool) {
            context.commit("SET_SHOW_WELCOME", bool);
        },
    },
    modules: {
    },
    plugins: [createPersistedState()],
});







