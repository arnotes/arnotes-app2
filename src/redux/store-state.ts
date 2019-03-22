import firebase from 'firebase';
import { INote } from '../models/note.interface';

export interface StoreState {
    user?: firebase.User;
    notes?: INote[];
    strSearch?: string;
    selectedNote?: INote;
}