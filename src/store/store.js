import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";
import services from '../services/app.service';
import defines from '../defines/define';
const jwt = require('jsonwebtoken');


Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userData: {},
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
        }
    },
    actions: {
        access(context, authUrl) {
            return new Promise((resolve, reject) => {
                //send request to access resource
                Vue.http.head(authUrl)
                .then(
                    (/*success*/) => {
                        context.state.progress = false;
                        resolve();
                    },
                    (failed) => {
                        if (failed.status == 401) {
                            // if  failed status is 401 
                            // that means there is an error on token 
                            // check storage and get refresh token from localStorage 
                            if (localStorage.grpm_store != null && localStorage.grpm_store != undefined) {
                                const grpm_store = JSON.parse(localStorage.grpm_store);
                                if (grpm_store.data != null && grpm_store.data != undefined) {
                                    const tokenRfrsh = JSON.parse(localStorage.grpm_store).data.tokenRfrsh;
                                    //send request to refresh token
                                    Vue.http.post(`${defines.SERVER_URL}${defines.TOKEN_URL}`, { tokenRfrsh })
                                        .then(
                                            success => {
                                                // store new token on success
                                                localStorage.grpm_store = JSON.stringify(success.body);
                                                // resend request to access resource
                                                Vue.http.head(authUrl)
                                                    .then(
                                                        () => {
                                                            // don't need to stop progress bar here
                                                            // cause refresh atcion already does it 
                                                            context.dispatch("refresh");
                                                            resolve();
                                                        },
                                                        failed => {
                                                            context.state.progress = false;
                                                            reject(failed);
                                                        }
                                                    );
                                            },
                                            failed => {
                                                // on failed means refresh token is either expired or invalid
                                                context.state.progress = false;
                                                reject(failed);
                                            }
                                        );
                                }
                                else {
                                    // if there is no data on localStore
                                    context.state.progress = false;
                                    reject(failed);
                                }
                            }
                            else {
                            // if there is no store on localStore
                                context.state.progress = false;
                                reject(failed);
                            } 
                        }
                        else {
                            // if error other than 401 
                            context.state.progress = false;
                            reject(failed);
                        } 
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
            return new Promise((resolve, reject) => {
                if (editorData && services.isNotEmpty(editorData)) {
                    let pub = editorData.replace("\\", "/");
                    pub = pub.replace("'", "\\'");
                    Vue.http.post(`${defines.SERVER_URL}${defines.PUBLISH_URL}`, {publication: pub})
                        .then(
                            (/*success*/) => {
                                context.dispatch("refresh");
                                resolve();
                            },
                            (/*failed*/) => {
                                reject();
                            }
                        );
                }
                else {
                    context.state.dialogErrText = "Vous ne pouvez pas créer de publication vide";
                    context.state.dialogErr = true;
                    reject();
                }  
            });
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
                Vue.http.patch(`${defines.SERVER_URL}${defines.READ_NOTIFICATION_URL}`, { notifId: item.notifId })
                .then( () => context.dispatch("refresh") );
            }
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
        delPub(context, pubId) {
            Vue.http.delete(`${defines.SERVER_URL}${defines.PUBLISH_DEL_URL}`, { params: { pubId }})
            .then( () => context.dispatch("refresh") );
        },
        delCom(context, data) {
            Vue.http.delete(`${defines.SERVER_URL}${defines.COMMENT_DEL_URL}`, { params: { comId: data.comId } })
            .then( () => context.dispatch("refresh") );
        },
        delNotif(context, notifId) {
            Vue.http.delete(`${defines.SERVER_URL}${defines.DEL_NOTIFICATION_URL}`, { params: { notifId } })
                .then(
                    (/*success*/) => {
                        context.dispatch("refresh");
                    },
                    (/*failed*/) => {
                    }
                );
        },
        delAccount(context, id) {
            return new Promise((resolve, reject) => {
                Vue.http.delete(`${defines.SERVER_URL}${defines.DEL_ACCOUNT_URL}`, { params: { id } })
                    .then(
                        (/*success*/) => {
                            context.dispatch("resetStore");
                            resolve();
                        },
                        (/*failed*/) => {
                            context.state.dialogErrText = "Une erreur est survenue lors de la suppression de votre compte.\nVeuillez réessayer.";
                            context.state.dialogErr = true;
                            reject();
                        },
                    );
            });
        },
        uptImgProf(context, file) {
            return new Promise((resolve, reject) => {

                if (!file)
                    return reject();
                const formData = new FormData();
                formData.append("image", file, file.name);
    
                Vue.http.post(`${defines.SERVER_URL}${defines.PROFIL_IMG_URL}`, formData)
                .then(
                    (success) => {
                        localStorage.grpm_store = JSON.stringify(success.body);
                        resolve(success.body.data.imgUrl);
                    },
                    (/*failed*/) => reject()
                );
            });

        },
        uptDescProf(context, desc) {
            return new Promise((resolve, reject) => {

                Vue.http.patch(`${defines.SERVER_URL}${defines.PROFIL_DESC_URL}`, { desc })
                    .then(
                        (success) => {
                            success.text()
                                .then(token => {
                                    localStorage.grpm_store = token;
                                    resolve();
                                });
                        },
                        (/*failed*/) => {
                            reject();
                        },
                );
            });
        },
        uptPasswdProf(context, data) {
            return new Promise((resolve, reject) => {
                Vue.http.patch(`${defines.SERVER_URL}${defines.PASSWORD_URL}`, { old: data.passwd, new: data.passwdChange })
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







