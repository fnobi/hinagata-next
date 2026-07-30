import { onCall } from "firebase-functions/v2/https";
import responseAppCallable from "~/lib/responseAppCallable";
import { userRecordSchema } from "@hinagata-next/core/feature/app-data-store-schema";
import { ServerDataStoreAgent } from "~/lib/ServerDataStoreAgent";
import { firebaseFirestore } from "~/lib/firebase-app";
import { COMMON_CALLABLE_REGION } from "@hinagata-next/core/feature/AppCallableSchema";
import { UserRecord } from "@hinagata-next/core/feature/UserRecord";

const userRecordDataStore = new ServerDataStoreAgent(
  firebaseFirestore,
  userRecordSchema
);

export default onCall({ region: COMMON_CALLABLE_REGION }, r =>
  responseAppCallable<"createUser">(r, async ({ data }) => {
    const { nickname } = data;
    const u: UserRecord = {
      nickname,
      createdAt: Date.now()
    };

    const userId = await userRecordDataStore.addItem({ data: u });

    return {
      case: "ok",
      data: {
        userId,
        data: u
      }
    };
  })
);
