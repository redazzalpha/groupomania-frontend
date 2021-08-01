
const storeServices = {
    // mutations
    TOGGLE_DRAWER: (state) => {
        state.drawer = !state.drawer;
    },
    SET_POST_ANSWER: (state, payload) => {
        state.postAnswer = payload;
    },    
    SET_GET_ANSWER: (state, payload) => {
        state.getAnswer = payload;
    },    
    // actions
    toggleDrawer: (context) => {
        context.commit("TOGGLE_DRAWER");
    },
    post: async function (/*context, payload*/) {


/****
 * 
 * 
 let answer = await fetch(payload.url, { method: "post", headers, body: JSON.stringify(payload.data) });
 let data = await answer.text();
 context.commit("SET_POST_ANSWER", data);
 * 
 * 
 * 
 */

    },
    get: async (context, payload) => {
        const headers = new Headers({
            "Accept": "application/json",
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${payload.data.token}`,
        });
        
        let answer = await fetch(payload.url, {method: "get", headers});
        let data = await answer.text();
        context.commit("SET_GET_ANSWER", data);
    },
    npost: () => {
        this.$http.post("http://localhost:8080/");
    },
};

export default storeServices;