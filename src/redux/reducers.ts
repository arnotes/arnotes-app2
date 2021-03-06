import { ReduxAction, IReduxAction } from "./redux-action.class";
import { ActionTypes } from "./action-types";
import { combineReducers } from "redux";
import { INote } from "../models/note.interface";
import { StoreState } from "./store-state";
import { IFolder } from "../models/folder.interface";
import { IDictionary } from "../models/dictionary.interface";

function user(userState:firebase.User, action:IReduxAction<firebase.User>) {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return action.data as firebase.User;
      break;
  
    default:
      return userState || null;
      break;
  }
}

function notes(notes:INote[], action:IReduxAction<INote[]>){
  switch (action.type) {
    case ActionTypes.SET_NOTE_LIST:
      return [...action.data];
      break;
  
    default:
      return notes||[];
      break;
  }
}

function folders(folders:IFolder[], action:IReduxAction<IFolder[]>){
  switch (action.type){
    case ActionTypes.SET_FOLDER_LIST:
      return [...action.data];
      break;
    default:
      return folders||[];
      break;      
  }
}

function filteredNotes(notes:INote[], action:IReduxAction<INote[]>){
  let returnVal:INote[] = [];
  switch (action.type) {
    case ActionTypes.SET_FILTERED_NOTE_LIST:
      if(action.data){
        returnVal = [...action.data];
      }
      break;
  
    default:
      if(notes){
        returnVal = [...notes];
      }
      break;
  }

  return returnVal.sort((a,b)=>a.Title.toLowerCase().localeCompare(b.Title.toLowerCase()));
}

function strSearch(str:string, action:IReduxAction<string>){
  switch (action.type) {
    case ActionTypes.SET_SEARCH_QUERY:
      return action.data;
      break;
  
    default:
      return str||"";
      break;
  }
}

function selectedNote(note:INote, action:IReduxAction<INote>){
  switch (action.type) {
    case ActionTypes.SET_SELECTED_NOTE:
      return action.data;
      break;
  
    default:
      return note||null;
      break;
  }
}

function openFolders(openFolders:IDictionary<boolean>, action:IReduxAction<IDictionary<boolean>>){
  switch (action.type) {
    case ActionTypes.SET_OPEN_FOLDERS:
      return {...action.data};
      break;
  
    default:
      return openFolders || {};
      break;
  }
}

export const combinedReducers = combineReducers({
  user,
  notes:notes,
  folders,
  strSearch:strSearch,
  filteredNotes:filteredNotes,
  selectedNote:selectedNote,
  openFolders
});