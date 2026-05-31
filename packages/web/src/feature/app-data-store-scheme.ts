import { type DataStoreScheme } from "~/common/DataStoreAgent";
import type DummyProfile from "@hinagata-next/core/feature/DummyProfile";
import { parseDummyProfile } from "@hinagata-next/core/feature/DummyProfile";

// eslint-disable-next-line import/prefer-default-export
export const profileDataStoreScheme: DataStoreScheme<DummyProfile, "userId"> = {
  name: "profiles",
  parse: parseDummyProfile,
  documentKey: "userId"
};
