import firebase from 'firebase';
const firebaseSvc = firebase.initializeApp({
    apiKey: process.env.REACT_APP_APIKEY,
        authDomain: process.env.REACT_APP_AUTHDOMAIN,
        projectId: process.env.REACT_APP_PROJECTID
});

export default firebaseSvc;