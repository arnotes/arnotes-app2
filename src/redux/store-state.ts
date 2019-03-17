import firebase from 'firebase';

export interface StoreState{
    user?: firebase.User;
}