import { getApps as getCurrentApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import firebaseConfig, { FIREBASE_ENABLED } from "~/common/firebaseConfig";

const FIREBASE_NAME = "default-firebase";

const getApp = () => {
  if (!FIREBASE_ENABLED) {
    throw new Error(
      "Firebaseが無効です。NEXT_PUBLIC_FIREBASE_ENABLED=true と NEXT_PUBLIC_FIREBASE_* の値を設定してください。"
    );
  }
  return (
    getCurrentApps().find(a => a.name === FIREBASE_NAME) ||
    initializeApp(firebaseConfig, FIREBASE_NAME)
  );
};

export const firebaseAuth = () => getAuth(getApp());
export const firebaseFunctions = (region?: string) =>
  getFunctions(getApp(), region);
export const firebaseStorage = () => getStorage(getApp());
export const firebaseFirestore = () => getFirestore(getApp());
