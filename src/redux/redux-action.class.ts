export interface IReduxAction<T> {
    type: string;
    data: T;
}

export class ReduxAction<T> implements IReduxAction<T>{
    constructor(type:string, data:T){
        this.type = type;
        this.data = data;
    }

    get value ():IReduxAction<T> {
       return {
           type: this.type,
           data: this.data
       }
    }

    type:string = null;
    data:T = null;
}