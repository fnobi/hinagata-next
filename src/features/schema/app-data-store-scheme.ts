import { type DataStoreScheme } from "~/common/lib/DataStoreAgent";
import type DummyProfile from "~/features/schema/DummyProfile";
import { parseDummyProfile } from "~/features/schema/DummyProfile";

// eslint-disable-next-line import/prefer-default-export
export const profileDataStoreScheme: DataStoreScheme<DummyProfile, "userId"> = {
  name: "profiles",
  parse: parseDummyProfile,
  documentKey: "userId"
};
