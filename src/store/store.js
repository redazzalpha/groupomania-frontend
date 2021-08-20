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
        dialogErr:false,
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






        /*
        onPickFile () { 
            Vue.loading = true;
            Vue.$refs.fileInput.click();

            setTimeout(() => {Vue.loading = false;}, defines.TIMEOUT)
        },
        putImg (context, e) { 

            const file = e.target.files[0];
            const freader = new FileReader();
            if(file)
                freader.readAsDataURL(file);
            freader.onload = () => {
                let img = document.createElement('img');
                img.src = freader.result;
                img.width = "100%";
                Vue.editorData += img.outerHTML;
            };            
        },
        // function used for show or unshow home view
        trigger(ready) {
            Vue.showPage = ready;
        },

        */




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
        test() {
            Vue.http.post("http://localhost:4000/app/hook");
        },
    },
    modules: {
    },
    plugins: [createPersistedState()],
});







