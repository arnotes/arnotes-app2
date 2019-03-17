import firebaseSvc from "./firebase.service";
import firebase from "firebase";

class AuthService{
    constructor(){
        this.auth = firebaseSvc.auth();
        this.googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    }

    private auth:firebase.auth.Auth;

    loginWithGoogle(){
        return this.auth.signInWithRedirect(this.googleAuthProvider);
    }

    googleAuthProvider:firebase.auth.GoogleAuthProvider = null;
}

const authSvc = new AuthService();
export default authSvc;