import { initializeApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";
import { env } from "../constants/env";

const firebaseConfig = {
  apiKey:            env.VITE_FIREBASE_API_KEY,
  authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       env.VITE_FIREBASE_DATABASE_URL,
  projectId:         env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let db:  Database  | null = null;

export const getFirebaseApp = (): FirebaseApp => {
  if (!app) app = initializeApp(firebaseConfig);
  return app;
};

export const getFirebaseDB = (): Database => {
  if (!db) db = getDatabase(getFirebaseApp());
  return db;
};
