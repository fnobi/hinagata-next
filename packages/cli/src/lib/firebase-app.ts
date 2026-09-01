import { styleText } from "util";
import { GOOGLE_CLOUD_PROJECT } from "~/lib/env";
import { type App, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let currentApp: App | null = null;

const getApp = () => {
  if (!currentApp) {
    currentApp = initializeApp(
      GOOGLE_CLOUD_PROJECT ? { projectId: GOOGLE_CLOUD_PROJECT } : undefined
    );
    console.log(
      styleText("green", `[projectId] ${currentApp.options.projectId}`)
    );
  }
  return currentApp;
};

export const firebaseAuth = () => getAuth(getApp());
export const firebaseFirestore = () => getFirestore(getApp());
export const firebaseStorage = () => getStorage(getApp());
