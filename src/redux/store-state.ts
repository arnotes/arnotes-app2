import firebase from 'firebase';
import { INote } from '../models/note.interface';
import { IFolder } from '../models/folder.interface';
import { IDictionary } from '../models/dictionary.interface';

export interface StoreState {
    user?: firebase.User;
    notes?: INote[];
    folders?: IFolder[];
    strSearch?: string;
    selectedNote?: INote;
    openFolders?: IDictionary<boolean>
}