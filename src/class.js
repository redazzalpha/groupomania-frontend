import Vue from 'vue';
import defines from './defines/define';

export class Utils {
    constructor() {
        this.Vue = Vue;
    }
    access(url) {
        return new Promise((resolve, reject) => {
            this.Vue.http.head(url)
            .then(success => resolve(success))
                .catch(failed => {
                    if (failed.status == 401) {
                        this.Vue.http.post(`${defines.SERVER_URL}${defines.TOKEN_URL}`, { tokenRfrsh: this.getTokenRfrsh() })
                            .then(
                                token => {
                                    localStorage.grpm_store = JSON.stringify(token.body);
                                    this.Vue.http.head(url)
                                        .then(success => resolve(success))
                                        .catch(failed => reject(failed) );
                                },
                                failed => reject(failed)
                            );
                    }
                    else reject(failed);
                });
        });
    }
    post(url, body) {
        return new Promise((resolve, reject) => {
            this.Vue.http.post(url, body)
                .then(
                    success => resolve(success),
                     async failed => {
                        if (failed.status == 401) {
                            this.Vue.http.post(`${defines.SERVER_URL}${defines.TOKEN_URL}`, { tokenRfrsh: this.getTokenRfrsh() })
                                .then(
                                    token => {
                                        localStorage.grpm_store = JSON.stringify(token.body);
                                        this.Vue.http.post(url, body)
                                            .then(
                                                success => resolve(success),
                                                failed => reject(failed)
                                            );                            
                                    },
                                    failed => reject(failed)
                                );
                            
                        }
                        else reject(failed);
                    },
                );
        });
    }
    put(url, body) {
        return new Promise((resolve, reject) => {
            this.Vue.http.put(url, body)
                .then(
                    success => resolve(success),
                    failed => {
                        if (failed.status == 401) {
                            this.post(`${defines.SERVER_URL}${defines.TOKEN_URL}`, { tokenRfrsh: this.getTokenRfrsh() })
                                .then(
                                    token => {
                                        localStorage.grpm_store = JSON.stringify(token.body);
                                        this.Vue.http.put(url, body)
                                            .then(
                                                success => resolve(success),
                                                failed => reject(failed)
                                            );
                                    },
                                    failed => reject(failed)
                                );
                        }
                        else reject(failed);
                    },
                );
        });
    }
    patch(url, body) {
        return new Promise((resolve, reject) => {
            this.Vue.http.patch(url, body)
                .then(
                    success => resolve(success),
                    failed => {
                        if (failed.status == 401) {
                            this.post(`${defines.SERVER_URL}${defines.TOKEN_URL}`, { tokenRfrsh: this.getTokenRfrsh() })
                                .then(
                                    token => {
                                        localStorage.grpm_store = JSON.stringify(token.body);
                                        this.Vue.http.patch(url, body)
                                            .then(
                                                success => resolve(success),
                                                failed => reject(failed)
                                            );
                                    },
                                    failed => reject(failed)
                                );
                        }
                        else reject(failed);
                    },
                );
        });
    }
    get(url, params) {
        return new Promise((resolve, reject) => {

            this.Vue.http.get(url, params)
                .then(
                    success => resolve(success),
                    failed => {
                        if (failed.status == 401) {
                            this.Vue.http.post(`${defines.SERVER_URL}${defines.TOKEN_URL}`, { tokenRfrsh: this.getTokenRfrsh() })
                                .then(
                                    token => {
                                        localStorage.grpm_store = JSON.stringify(token.body);
                                        this.Vue.http.get(url, params)
                                            .then(
                                                success => resolve(success),
                                                failed => reject(failed)
                                            );
                                    },
                                    failed => reject(failed)
                                );
                        }
                        else reject(failed);
                    },
                );
        });
    }
    head(url) {
        return new Promise((resolve, reject) => {
            this.Vue.http.head(url)
            .then(
                success => resolve(success),
                failed => {
                    if (failed.status == 401) {
                        this.Vue.http.post(`${defines.SERVER_URL}${defines.TOKEN_URL}`, { tokenRfrsh: this.getTokenRfrsh() })
                            .then(
                                token => {
                                    localStorage.grpm_store = JSON.stringify(token.body);
                                    this.Vue.http.head(url)
                                        .then(
                                            success => resolve(success),
                                            failed => reject(failed)
                                        );
                                },
                                failed => reject(failed)
                            );
                    }
                    else reject(failed);
                },
            );
        });
    }
    delete(url, params) {
        return new Promise((resolve, reject) => {
            this.Vue.http.delete(url, params)
                .then(
                    success => resolve(success),
                    failed => {
                        if (failed.status == 401) {
                            this.post(`${defines.SERVER_URL}${defines.TOKEN_URL}`, { tokenRfrsh: this.getTokenRfrsh() })
                                .then(
                                    token => {
                                        localStorage.grpm_store = JSON.stringify(token.body);
                                        this.Vue.http.delete(url, params)
                                            .then(
                                                success => resolve(success),
                                                failed => reject(failed)
                                            );
                                    },
                                    failed => reject(failed)
                                );
                        }
                        else reject(failed);
                    },
                );
        });
    }
    getToken() {
        let token = null, grpm_store = null;
        if (localStorage.grpm_store != null && localStorage.grpm_store != undefined)
            grpm_store = JSON.parse(localStorage.grpm_store);
            if (grpm_store.data != null && grpm_store.data != undefined)
            token = JSON.parse(localStorage.grpm_store).data.token;
        return token;
    }
    getTokenRfrsh() {
        let tokenRfrsh = null, grpm_store = null;

        if (localStorage.grpm_store != null && localStorage.grpm_store != undefined) {
            grpm_store = JSON.parse(localStorage.grpm_store);
            if (grpm_store.data != null && grpm_store.data != undefined)
                tokenRfrsh = JSON.parse(localStorage.grpm_store).data.tokenRfrsh;
        }
        return tokenRfrsh;
    }
}