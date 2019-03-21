import { ReduxAction, IReduxAction } from "./redux-action.class";
import { ActionTypes } from "./action-types";
import { combineReducers } from "redux";
import { INote } from "../models/note.interface";
import { StoreState } from "./store-state";

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

function filteredNotes(notes:INote[], action:IReduxAction<INote[]>){
  switch (action.type) {
    case ActionTypes.SET_FILTERED_NOTE_LIST:
      return [...action.data];
      break;
  
    default:
      return notes||[];
      break;
  }
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

export const combinedReducers = combineReducers({
  user,
  notes:notes,
  strSearch:strSearch,
  filteredNotes:filteredNotes
});