import { useEffect } from "react";
import {
  getRedirectResult,
  onAuthStateChanged,
  type User
} from "firebase/auth";
import { create } from "zustand";
import { firebaseAuth } from "~/common/firebase-app";

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

export const useAuthRoot = () => {
  const meState = useMeStore();

  useEffect(() => {
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
