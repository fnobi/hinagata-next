import { FirebaseError } from "firebase/app";

type FirebaseErrorParameter =
  | {
      type: "firestore-permission-error";
    }
  | {
      type: "firestore-precondition-error";
    }
  | {
      type: "firestore-unknown-error";
    }
  | {
      type: "firebase-auth-invalid-credential";
    }
  | {
      type: "firebase-auth-email-already-in-use";
    }
  | { type: "firebase-auth-expired-action-code" }
  | { type: "firebase-auth-weak-password" };

export const extractFirebaseError = (e: unknown): FirebaseErrorParameter => {
  if (e instanceof FirebaseError) {
    const { code } = e;
    if (code === "failed-precondition") {
      // NOTE: エラーログにindex設定用のリンクが来るのでログしてほしい
      console.error(e);
      return { type: "firestore-precondition-error" };
    }
    if (code === "permission-denied") {
      return { type: "firestore-permission-error" };
    }
    if (code === "auth/invalid-credential") {
      return { type: "firebase-auth-invalid-credential" };
    }
    if (code === "auth/email-already-in-use") {
      return { type: "firebase-auth-email-already-in-use" };
    }
    if (
      code === "auth/expired-action-code" ||
      code === "auth/invalid-action-code"
    ) {
      return { type: "firebase-auth-expired-action-code" };
    }
    if (code === "auth/weak-password") {
      return { type: "firebase-auth-weak-password" };
    }
  }
  return { type: "firestore-unknown-error" };
};

export default FirebaseErrorParameter;
