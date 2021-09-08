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
        userPubs: [],
        comments: [],
        notifs: [],
        dialogErrText: "",
        dialogErr: false,
        success: false,
        progress: false,
        showWelcome: true,
        darkMode: false,
        pubCount: 0,
        userPubCount: 0,
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
        SET_USER_PUBS(state, pubs) {
            state.userPubs = pubs;
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
        SET_DARK_MODE(state, bool) {
            state.darkMode = bool;
        }
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
                                    context.state.darkMode = !!context.state.userData.dark;
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
                            else if (failed.status == 0) {
                                context.state.dialogErrText = `Le serveur est indisponible.`;
                                context.state.dialogErr = true;
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
                            if (failed.body.error) {
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
                            }
                            else if (failed.status == 0) {
                                context.state.dialogErrText = `Le serveur est indisponible.`;
                                context.state.dialogErr = true;
                            }
                            reject(failed);
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
                context.dispatch("refresh", context.state.publications.length);
                return result;
            }
            // if comment is empty set error dialog
            else {
                context.state.dialogErrText = "Vous ne pouvez pas créer de commentaire vide";
                context.state.dialogErr = true;
            }
        },
        async getPubs(context, limit) {
            const utils = new Utils();
            const result = await utils.get(`${defines.SERVER_URL}${defines.PUBLISH_URL}`, { params: { limit: limit ? limit : 2 } });
            context.state.publications = result.body.results;
            context.dispatch("pubsCount");
            return result;
        },
        async getUserPubs(context, id) {
            context.state.progress = true;
            const utils = new Utils();
            const result = await utils.get(`${defines.SERVER_URL}${defines.PUBLISH_USER_URL}`, { params: { id, limit: 2 } });
            context.state.userPubs = result.body.results;
            context.dispatch("userPubsCount", id);
            setTimeout(() => { context.state.progress = false; }, defines.TIMEOUT);
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
        async like(context, obj) {
            const data = obj.item;
            const array = obj.usedArray;
            if (data.userIdLike)
                data.userIdLike.push(context.state.userData.userId);
            else data.userIdLike = [context.state.userData.userId];
            const payload = { data };
            
            const utils = new Utils();
            const result = await utils.post(`${defines.SERVER_URL}${defines.PUBLISH_LIKE_URL}`, payload);

            const pub = array.find(item => item.pubId == data.pubId);

            pub.postLike = result.body.postLike;
            pub.userIdLike.push(context.state.userData.userId);
            return result;
        },
        async unlike(context, obj) {
            const data = obj.item;
            const array = obj.usedArray;

            data.userIdLike = data.userIdLike.filter(item => { return item != context.state.userData.userId; });
            const payload = { data };

            const utils = new Utils();
            const result = await utils.post(`${defines.SERVER_URL}${defines.PUBLISH_UNLIKE_URL}`, payload);

            const pub = array.find(item => item.pubId == data.pubId);

            pub.postLike = result.body.postLike;
            pub.userIdLike = pub.userIdLike.filter(item => item != context.state.userData.userId);

            return result;
        },
        async dislike(context, obj) {
            const data = obj.item;
            const array = obj.usedArray;

            if (data.userIdDislike)
                data.userIdDislike.push(context.state.userData.userId);
            else data.userIdDislike = [context.state.userData.userId];
            const payload = { data };

            const utils = new Utils();
            const result = await utils.post(`${defines.SERVER_URL}${defines.PUBLISH_DISLIKE_URL}`, payload);

            const pub = array.find(item => item.pubId == data.pubId);
            pub.postDislike = result.body.postDislike;
            pub.userIdDislike.push(context.state.userData.userId);
            return result;
        },
        async undislike(context, obj) {
            const data = obj.item;
            const array = obj.usedArray;

            data.userIdDislike = data.userIdDislike.filter(item => { return item != context.state.userData.userId; });
            const payload = { data };

            const utils = new Utils();
            const result = await utils.post(`${defines.SERVER_URL}${defines.PUBLISH_UNDISLIKE_URL}`, payload);

            const pub = array.find(item => item.pubId == data.pubId);
            pub.postDislike = result.body.postDislike;
            pub.userIdDislike = pub.userIdDislike.filter(item => item != context.state.userData.userId);
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
            context.dispatch("refresh", context.state.publications.length);
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
        async uptPasswdProf(context, data) {
            try {
                const utils = new Utils();
                await utils.patch(`${defines.SERVER_URL}${defines.PASSWORD_URL}`, { old: data.passwd, new: data.passwdChange });
                context.state.success = true;
                setTimeout(() => { context.state.success = false; }, defines.TIMEOUT * 10);
            }
            catch (e) {
                context.state.dialogErrText = "Le mot de passe que vous avez saisi est incorrect";
                context.state.dialogErr = true;
                context.state.success = false;
                
            }
        },
        async pubScroll(context) {
            // this function is used to 
            // infinite scroll all pubs
            // from home page
            window.onscroll = async (e) => {
                const bottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
                const homePage = e.target.location.pathname == '/app/home';
                if (bottom && homePage) {
                    let size = context.state.publications ? context.state.publications.length : 0;
                    let lpubid = { id: size ? context.state.publications[size - 1].pubId : 0 };
                    const utils = new Utils();
                    if (size > 1 && size < context.state.pubCount) {
                        const result = await utils.get(`${defines.SERVER_URL}${defines.PUBLISH_SCROLL_URL}`, { params: { lpubid } });
                        for (let item of result.body.results)
                        context.state.publications.push(item);
                    }
                }
            };
        },
        async userPubScroll(context) {
            // this function is used to 
            // infinite scroll user pubs
            // from team user profile page
            let size = context.state.userPubs ? context.state.userPubs.length : 0;
            let lpubid = { id: size ? context.state.userPubs[size - 1].pubId : 0 };
            const utils = new Utils();
            if (size > 1 && size < context.state.userPubCount) {
                const result = await utils.get(`${defines.SERVER_URL}${defines.PUBLISH_USER_SCROLL_URL}`, { params: { lpubid } });
                for (let item of result.body.results)
                    context.state.userPubs.push(item);
            }
        },
        async pubsCount(context) {
            const utils = new Utils();
            const success = await utils.get(`${defines.SERVER_URL}${defines.PUBLISH_COUNT_URL}`);
            context.state.pubCount = success.body.results[0]["count(*)"];
        },
        async userPubsCount(context, id) {
            const utils = new Utils();
            const success = await utils.get(`${defines.SERVER_URL}${defines.PUBLISH_USER_COUNT_URL}`, { params: { id }});
            context.state.userPubCount = success.body.results[0]["count(*)"];
        },
        async refresh(context, limit) {
            try {

                context.state.progress = true;
                await context.dispatch("getPubs", limit);
                await context.dispatch("getComs");
                await context.dispatch("getNotifs");
            }
            finally {
                setTimeout(() => { context.state.progress = false; }, defines.TIMEOUT);
            }
        },
        resetStore(context) {
            context.state.userData = {};
            context.state.users = [];
            context.state.publications = [];
            context.state.comments = [];
            context.state.notifs = [];
            context.state.dialogErrText = "";
            context.state.dialogErr = false;
            context.state.success = false;
            context.state.progress = false;
            context.state.showWelcome = false;
            context.state.darkMode = false;
            context.state.pubCount = 0;
            context.state.userPubCount = 0;
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
        setUserPubs(context, pubs) {
            context.commit("SET_USER_PUBS", pubs);
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
        async setDarkMode(context, bool) {
            try {
                const utils = new Utils();
                await utils.post(`${defines.SERVER_URL}${defines.PROFIL_MODE_URL}`, { dark: bool? 1 : 0 });
                return bool;
            }
            finally {
                context.state.userData.dark = bool? 1 : 0;
                context.commit('SET_DARK_MODE', bool);
            }
        },
    },
    modules: {
    },
    plugins: [createPersistedState()],
});







