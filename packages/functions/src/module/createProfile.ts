import { onCall } from "firebase-functions/v2/https";
import responseAppCallable from "~/lib/responseAppCallable";
import { profileDataStoreSchema } from "@hinagata-next/core/feature/app-data-store-schema";
import { ServerDataStoreAgent } from "~/lib/ServerDataStoreAgent";
import { firebaseFirestore } from "~/lib/firebase-app";
import { COMMON_CALLABLE_REGION } from "@hinagata-next/core/feature/AppCallableSchema";
import AppError from "@hinagata-next/core/feature/AppError";

const profileDataStore = new ServerDataStoreAgent(
  firebaseFirestore,
  profileDataStoreSchema
);

export default onCall({ region: COMMON_CALLABLE_REGION }, r =>
  responseAppCallable<"createProfile">(r, async ({ auth, data }) => {
    if (!auth) {
      throw new AppError({ type: "unauthorized" });
    }
    const { profile } = data;
    const charaId = await profileDataStore.addItem({ data: profile });
    return {
      case: "ok",
      data: {
        charaId,
        profile
      }
    };
  })
);
