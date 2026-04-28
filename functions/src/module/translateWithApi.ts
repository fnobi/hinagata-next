import { onCall } from "firebase-functions/v2/https";
import responseAppCallable from "@/local/responseAppCallable";
import { getSecretParams, getSecretString } from "@/local/secret-manager";
import { COMMON_CALLABLE_REGION } from "~/features/schema/AppCallableScheme";

export default onCall(
  {
    region: COMMON_CALLABLE_REGION,
    secrets: getSecretParams("DEEPL_API_KEY")
  },
  req =>
    responseAppCallable<"translateWithApi">(req, async ({ data }) => {
      const { jaWord } = data;
      const DEEPL_API_KEY = getSecretString("DEEPL_API_KEY");
      const res = await fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST",
        headers: {
          Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: [jaWord], target_lang: "EN" })
      });
      if (!res.ok) {
        throw new Error(`DeepL error: ${res.status}`);
      }
      const json = (await res.json()) as {
        translations: { text: string }[];
      };
      return {
        case: "ok",
        data: { enWord: json.translations[0].text }
      };
    })
);
