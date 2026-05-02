import { useEffect } from "react";
import {
  getRedirectResult,
  onAuthStateChanged,
  type User
} from "firebase/auth";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { firebaseAuth } from "~/common/lib/firebase-app";

export type MeState = {
  isAuthLoading: boolean;
  myId: string | null;
  myEmail: string | null;
  emailVerificationProgress: boolean;
};

type MeStore = MeState & {
  setMe: (payload: Partial<MeState>) => void;
};

const useMeStore = create<MeStore>(set => ({
  isAuthLoading: true,
  myId: null,
  myEmail: null,
  emailVerificationProgress: false,
  setMe: (payload: Partial<MeState>) =>
    set(s => ({ ...s, ...payload, isAuthLoading: false }))
}));

export const useAuthorizedUser = (): MeState =>
  useMeStore(
    useShallow(({ isAuthLoading, myId, myEmail, emailVerificationProgress }) => ({
      isAuthLoading,
      myId,
      myEmail,
      emailVerificationProgress
    }))
  );

export const useAuthRoot = () => {
  const setMe = useMeStore(s => s.setMe);

  useEffect(() => {
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
        setMe({ isAuthLoading: false, myId: null, myEmail: null });
      }
    };
    getRedirectResult(firebaseAuth());
    return onAuthStateChanged(firebaseAuth(), handleAuthStateChange);
  }, [setMe]);

  return useAuthorizedUser();
};
