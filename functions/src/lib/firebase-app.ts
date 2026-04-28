import { type App, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { config as functionsConfig } from "firebase-functions";

let currentApp: App | null = null;

const getApp = () => {
  if (!currentApp) {
    currentApp = initializeApp(functionsConfig().firebase);
  }
  return currentApp;
};

export const firebaseAuth = () => getAuth(getApp());
export const firebaseFirestore = () => getFirestore(getApp());
export const firebaseStorage = () => getStorage(getApp());
