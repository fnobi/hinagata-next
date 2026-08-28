// firebase系のsecrets(NEXT_PUBLIC_FIREBASE_*)がまだ用意できていない開発初期段階でも
// アプリを起動できるように、明示的に "true" が設定されている場合のみ実際にfirebaseへ
// アクセスする。値を設定していない/trueでない場合、useAuthRoot等はfirebaseへの
// アクセスをスキップする。
export const FIREBASE_ENABLED =
  process.env.NEXT_PUBLIC_FIREBASE_ENABLED === "true";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
};

export default firebaseConfig;
