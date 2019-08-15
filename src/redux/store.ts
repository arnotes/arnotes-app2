import { createStore } from 'redux';
import { combinedReducers } from './reducers';
let devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__();
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  // dev code
} else {
  devTools = undefined;  
}
export const store = createStore(combinedReducers, {}, devTools);