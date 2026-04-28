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
      console.log("api key:", DEEPL_API_KEY);
      return {
        case: "ok",
        data: {
          enWord: jaWord // TODO
        }
      };
    })
);
