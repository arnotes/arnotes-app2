import { IReduxAction } from "../redux/redux-action.class";

export type mapDispatchFn = (dispatch:any)=>any;
export type dispatchFn = <T>(action:IReduxAction<T>)=>any