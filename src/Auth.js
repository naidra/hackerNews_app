import auth0 from 'auth0-js';
import jwtDecode from 'jwt-decode';

const AUTH_LOCALSTORAGE = 'auth_stuff';

export default class Auth {
    auth0 = new auth0.WebAuth({
        domain: "ardian.auth0.com",
        clientID: "AMuDO5TreYg09dsc26v3CzbkT0JvUjIG",
        // redirectUri: "http://my2btc.com/newsApp",
        redirectUri: "http://localhost:3000/",
        audience: "https://ardian.auth0.com/userinfo",
        responseType: "token id_token",
        scope: "openid profile"
    })

    constructor() {
        this.logIn = this.logIn.bind(this);
        this.logOut = this.logOut.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
    }
    logIn() {
        this.auth0.authorize();
    }
    handleAuthentication(callThisAfter) {
        this.auth0.parseHash((err, authResults) => {
            if(authResults && authResults.accessToken && authResults.idToken) {
                let expiresAt = (authResults.expiresIn) * 1000 + new Date().getTime();
                const authStuff = {
                    access_token: authResults.accessToken,
                    id_token: authResults.idToken,
                    expires_at: expiresAt
                };

                localStorage.setItem(AUTH_LOCALSTORAGE, JSON.stringify(authStuff));
                callThisAfter({isLogedIn: true});
            } else if(err) {
                if(err.error === "unauthorized") {
                    callThisAfter({error: err.errorDescription});
                    console.log('Error', err.errorDescription);
                }
            }
        });
    }
    isAuthenticated() {
        if(!localStorage.getItem(AUTH_LOCALSTORAGE)) return false;
        const authStuff = JSON.parse(localStorage.getItem(AUTH_LOCALSTORAGE));
        return new Date().getTime() < authStuff.expires_at;
    }
    logOut() {
        localStorage.removeItem(AUTH_LOCALSTORAGE);
    }
    getProfile() {
        if(!localStorage.getItem(AUTH_LOCALSTORAGE)) return null;
        const authStuff = JSON.parse(localStorage.getItem(AUTH_LOCALSTORAGE));
        return jwtDecode(authStuff.id_token);
    }
}