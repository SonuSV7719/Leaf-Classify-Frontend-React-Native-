import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDsWl6wxqWOoovMUvOChB6D41RkmWDC47s",
  authDomain: "leaflens-2dd86.firebaseapp.com",
  projectId: "leaflens-2dd86",
  storageBucket: "leaflens-2dd86.appspot.com",
  messagingSenderId: "137662627439",
  appId: "1:137662627439:web:f5d4e948709a899578979a",
  measurementId: "G-R13WN3LKRY"
};



export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
  
// export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
