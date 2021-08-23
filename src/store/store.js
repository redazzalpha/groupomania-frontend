import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";
import services from '../services/app.service';
import defines from '../defines/define';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userData: null,
        publications: [],
        comments: [],
        notifs: [],
        dialogErrText: "",
        dialogErr: false,
        success: false,
        drawer: false,
    },
    mutations: {

        SET_DIAL_ERR(state, bool) {
            state.dialogErr = bool;
        },
        SET_USER_DATA(state, payload) {
            state.userData = payload;
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
        TOGGLE_DRAWER(state) {
            state.drawer = !state.drawer;
        },
    },
    actions: {
        login(context, data) {
                return new Promise((resolve, reject) => {
                    Vue.http.post(`${defines.SERVER_URL}${defines.LOGIN_URL}`, data)
                    .then(
                        success => {
                            success.text()
                            .then(token => {
                                localStorage.grpm_store = token;
                                resolve();
                            });         
                        },
                        failed => {
                            switch(failed.body.error.code) {
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
                            reject();
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
                        switch(failed.body.error.code) {
                            case "ER_DUP_ENTRY":
                                context.state.dialogErr = true;
                                context.state.dialogErrText = "L'utilisateur que vous essayez de créer existe déjà.";
                                break;
                            default:
                                throw new Error("Unknown error");    
                        }
                        reject();
                    }
                );
            });
        },
        publish(context, editorData) {
            if (editorData && services.isNotEmpty(editorData)) {
                let pub = editorData.replace("\\", "/");
                pub = pub.replace("'", "\\'");
                Vue.http.post(`${defines.SERVER_URL}${defines.PUBLISH_URL}`, {publication: pub})
                .then( () => context.dispatch("refresh") );
            }
            else {
                context.state.dialogErrText = "Vous ne pouvez pas créer de publication vide";
                context.state.dialogErr = true;
            }  
        },
        comment(context, data) {
            // check if publication if empty   
            if(data.comText && services.isNotEmpty(data.comText)) {
                // create payload
                const payload = {
                    parentId: data.parentId,
                    comText: data.comText,
                    authorId: data.authorId,
                };
                // post request
                Vue.http.post(`${defines.SERVER_URL}${defines.COMMENT_URL}`, payload)
                .then( () => context.dispatch("refresh") );
            }
            // if comment is empty set error dialog
            else {
                context.state.dialogErrText  = "Vous ne pouvez pas créer de commentaire vide";
                context.state.dialogErr = true;
            }  
        },
        getPubs(context) {
            return new Promise((resolve, reject) => {
                // get request
                Vue.http.get(`${defines.SERVER_URL}${defines.PUBLISH_URL}`)
                .then(
                    (success) => {
                        context.dispatch("setPublications", success.body.results);
                        resolve();
                    },
                    (failed) => {
                        reject(failed);
                    }
                );
            });
        },
        getComs(context) {
            return new Promise((resolve, reject) => {
                // get request
                Vue.http.get(`${defines.SERVER_URL}${defines.COMMENT_URL}`)
                .then(
                    (success) => {
                        context.dispatch("setComments", success.body.results);
                        resolve();
                    },
                    (failed) => {reject(failed);}
                );
            });
        },
        getNotifs(context) {
            return new Promise((resolve, reject) => {
                Vue.http.get(`${defines.SERVER_URL}${defines.NOTIFICATION_URL}`)
                .then(
                    (success) => {
                        const notifs = success.body.results.filter(item => item.whereId == context.state.   userData.userId);
                        context.dispatch("setNotifs", notifs);                        
                        resolve();
                    },
                    (failed) => { reject(failed); }
                );
            });
        },
        readNotif(context, item) {
            if(item.state == "unread") {
                Vue.http.post(`${defines.SERVER_URL}${defines.READ_NOTIFICATION_URL}`, {notifId: item.notifId})
                .then( () => context.dispatch("refresh") );
            }
        },
        delNotif(context, notifId) {
            Vue.http.post(`${defines.SERVER_URL}${defines.DEL_NOTIFICATION_URL}`, { notifId })
                .then(
                    (/*success*/) => {
                        context.dispatch("refresh");
                    },
                    (/*failed*/) => {
                    }
                );
        },
        delPub(context, pubId) {
            const payload = { pubId };
            Vue.http.post(`${defines.SERVER_URL}${defines.PUBLISH_DEL_URL}`, payload)
            .then( () => context.dispatch("refresh") );
        },
        delCom(context, data) {
            const payload = { 
                comId: data.comId,
                pubId: data.pubId,
            };
            Vue.http.post(`${defines.SERVER_URL}${defines.COMMENT_DEL_URL}`, payload)
            .then( () => context.dispatch("refresh") );
        },
        refresh(context) {
            context.dispatch("getPubs")
                .then( () => {
                    context.dispatch("getComs")
                        .then( () => {
                            context.dispatch("getNotifs");
                        })
                        .catch();
                })
                .catch();
        },
        like(context, data){
            if(data.userIdLike)             
                data.userIdLike.push(context.state.userData.userId);
            else data.userIdLike = [context.state.userData.userId];
            const payload = { data };  
            Vue.http.post(`${defines.SERVER_URL}${defines.PUBLISH_LIKE_URL}`, payload)
            .then( () =>  context.dispatch("refresh") );
        },
        unlike(context, data) {
            data.userIdLike = data.userIdLike.filter(item => {return item != context.state.userData.userId;} );
            const payload = { data };  
            Vue.http.post(`${defines.SERVER_URL}${defines.PUBLISH_UNLIKE_URL}`, payload)
            .then( () =>  context.dispatch("refresh") );
        },
        dislike(context, data) {
            if(data.userIdDislike)
                data.userIdDislike.push(context.state.userData.userId);
            else data.userIdDislike = [context.state.userData.userId];
            const payload = { data };            
            Vue.http.post(`${defines.SERVER_URL}${defines.PUBLISH_DISLIKE_URL}`, payload)
            .then( () =>  context.dispatch("refresh") );
        },
        undislike(context, data) {
            data.userIdDislike = data.userIdDislike.filter(item => {return item != context.state.userData.userId;} );
            const payload = { data };            
            Vue.http.post(`${defines.SERVER_URL}${defines.PUBLISH_UNDISLIKE_URL}`, payload)
            .then( () =>  context.dispatch("refresh") );
        },
        savePasswd(context, data) {
            return new Promise((resolve, reject) => {
                Vue.http.patch(`${defines.SERVER_URL}${defines.PASSWORD_URL}/${data.passwd}&${data.passwdChange}`)
                .then(
                    () => {
                        context.state.success = true;
                        setTimeout(() => { context.state.success = false; }, defines.TIMEOUT * 2);
                        resolve();
                    },
                    () => {
                        context.state.dialogErrText = "Le mot de passe que vous avez saisi est incorrect";
                        context.state.dialogErr = true;
                        context.state.success = false;
                        reject();
                    }
                );  
                
            });
        },
        deleteProfil(context, id) {
            return new Promise((resolve, reject) => {
                Vue.http.delete(`${defines.SERVER_URL}${defines.PROFIL_URL}/${id}`)
                    .then(
                        (/*sucess*/) => resolve(),
                        (/*failed*/) => {
                            context.state.dialogErrText = "Une erreur est survenue lors de la suppression de votre compte.\nVeuillez réessayer.";
                            context.state.dialogErr = true;
                            reject();
                        },
                    );
            });
        },
        uploadImg(context, file) {
            return new Promise((resolve, reject) => {

                const formData = new FormData();
                formData.append("image", file, file.name);
     
                Vue.http.post(`${defines.SERVER_URL}${defines.IMG_URL}`, formData)
                .then(
                    (success) => resolve(success.body.imgUrl),
                    (/*failed*/) => reject(),
                ); 
            });
        },
        setDialErr(context, bool) {
            context.commit("SET_DIAL_ERR", bool);
        },
        setUserData(context, payload) {
            context.commit("SET_USER_DATA", payload);
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
        toggleDrawer(context) {
            context.commit("TOGGLE_DRAWER");
        },
    },
    modules: {
    },
    plugins: [createPersistedState()],
});







