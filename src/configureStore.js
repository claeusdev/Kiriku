import rootReducer from './reducers';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { loadFromLocalStorage, saveToLocalStorage } from './utils/store';
import throttle from 'lodash/throttle';

import { routerReducer, routerMiddleware } from 'react-router-redux';

import firebase from 'firebase';
import 'firebase/firestore'; // add this to use Firestore
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';

const firebaseConfig = {
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
};

const reactReduxFirebaseConfig = { 
  userProfile: 'users',
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
  profileFactory: (userData, profileData) => { // how profiles are stored in database
    return profileData;
  }
};

// initialize firebase instance with config from console
firebase.initializeApp(firebaseConfig)

// initialize Firestore
firebase.firestore()

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, reactReduxFirebaseConfig),
  reduxFirestore(firebase)
)(createStore)

const configureStore = (history) => {
  const navigationMiddleware = routerMiddleware(history)
  const loggerMiddleware = createLogger();
  const persistedState = loadFromLocalStorage();
  const store = createStoreWithFirebase(
    combineReducers({
      app: rootReducer,
      router: routerReducer,
      firebase: firebaseReducer,
      firestore: firestoreReducer
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
