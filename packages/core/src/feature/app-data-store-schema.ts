import { type DataStoreSchema } from "@hinagata-next/core/common/DataStoreAgent";
import {
  type UserRecord,
  parseUserRecord
} from "@hinagata-next/core/feature/UserRecord";

export const userRecordSchema: DataStoreSchema<UserRecord, "userId"> = {
  name: "users",
  documentKey: "userId",
  parse: parseUserRecord
};
