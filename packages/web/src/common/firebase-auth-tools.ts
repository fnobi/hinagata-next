import { useEffect } from "react";
import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  type User
} from "firebase/auth";
import { create } from "zustand";
import { firebaseAuth } from "~/common/firebase-app";
import { FIREBASE_ENABLED } from "~/common/firebaseConfig";

export type MeState = {
  isAuthLoading: boolean;
  myId: string | null;
  myEmail: string | null;
  emailVerificationProgress: boolean;
};

const useMeStore = create<MeState>(() => ({
  isAuthLoading: true,
  myId: null,
  myEmail: null,
  emailVerificationProgress: false
}));

export const useAuthorizedUser = () => useMeStore();

export const signInWithGoogle = () =>
  signInWithPopup(firebaseAuth(), new GoogleAuthProvider());

export const useAuthRoot = () => {
  const meState = useMeStore();

  useEffect(() => {
    if (!FIREBASE_ENABLED) {
      useMeStore.setState(s => ({ ...s, isAuthLoading: false }));
      return undefined;
    }
    const setMe = (payload: Partial<MeState>) =>
      useMeStore.setState(s => ({
        ...s,
        ...payload,
        isAuthLoading: false
      }));

    const cleanMe = (payload: { reset?: boolean }) =>
      useMeStore.setState(s => ({
        ...s,
        isAuthLoading: payload.reset || false,
        myId: null,
        myEmail: null
      }));
    const handleAuthStateChange = (user: User | null) => {
      if (user) {
        const isEmailUser = user.providerData.find(
          p => p.providerId === "password"
        );
        setMe({
          myId: user.uid,
          myEmail: user.email,
          emailVerificationProgress: isEmailUser && !user.emailVerified
        });
      } else {
        cleanMe({ reset: false });
      }
    };
    getRedirectResult(firebaseAuth());
    return onAuthStateChanged(firebaseAuth(), handleAuthStateChange);
  }, []);

  return meState;
};
