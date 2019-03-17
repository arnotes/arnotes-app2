import { ReduxAction, IReduxAction } from "./redux-action.class";
import { ActionTypes } from "./action-types";
import { combineReducers } from "redux";

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

export const combinedReducers = combineReducers({
  user
});