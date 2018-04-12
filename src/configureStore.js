import rootReducer from './reducers';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { loadFromLocalStorage, saveToLocalStorage } from './utils/store';
import throttle from 'lodash/throttle';

import { routerReducer, routerMiddleware } from 'react-router-redux';
import { reactReduxFirebase, firebaseStateReducer } from 'react-redux-firebase'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
};

const reduxFirebaseConfig = { userProfile: 'users' }
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebaseConfig, reduxFirebaseConfig),
)(createStore)

const configureStore = (history) => {
  const navigationMiddleware = routerMiddleware(history)
  const loggerMiddleware = createLogger();
  const persistedState = loadFromLocalStorage();
  const store = createStoreWithFirebase(
    combineReducers({
      app: rootReducer,
      router: routerReducer,
      firebase: firebaseStateReducer
    }),
    persistedState,
    applyMiddleware(thunkMiddleware, loggerMiddleware, navigationMiddleware)
  );

  store.subscribe(throttle(() => {
    saveToLocalStorage(store.getState());
  }));

  return store;
}

export default configureStore;
