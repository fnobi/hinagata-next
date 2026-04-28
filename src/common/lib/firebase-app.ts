import { getApps as getCurrentApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import firebaseConfig from "~/common/lib/firebaseConfig";

const FIREBASE_NAME = "default-firebase";

const getApp = () =>
  getCurrentApps().find(a => a.name === FIREBASE_NAME) ||
  initializeApp(firebaseConfig, FIREBASE_NAME);

export const firebaseAuth = () => getAuth(getApp());
export const firebaseFunctions = (region?: string) =>
  getFunctions(getApp(), region);
export const firebaseStorage = () => getStorage(getApp());
export const firebaseFirestore = () => getFirestore(getApp());
