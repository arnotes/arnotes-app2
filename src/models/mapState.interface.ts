import { StoreState } from "../redux/store-state";

export type mapStateFn<T> = (state:StoreState)=>T;