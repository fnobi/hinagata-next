import { type DataStoreScheme } from "@hinagata-next/core/common/DataStoreAgent";
import {
  type UserRecord,
  parseUserRecord
} from "@hinagata-next/core/feature/UserRecord";

export const userRecordScheme: DataStoreScheme<UserRecord, "userId"> = {
  name: "users",
  documentKey: "userId",
  parse: parseUserRecord
};
