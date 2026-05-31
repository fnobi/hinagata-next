import { defineSecret } from "firebase-functions/params";

type SECRET_KEYS = "DEEPL_API_KEY";

export const getSecretString = (k: SECRET_KEYS) => process.env[k] || "";

export const getSecretParams = (...keys: SECRET_KEYS[]) =>
  keys.map(k => defineSecret(k));
