import { type DataStoreSchema } from "@hinagata-next/core/common/DataStoreAgent";
import type DummyProfile from "@hinagata-next/core/feature/DummyProfile";
import { parseDummyProfile } from "@hinagata-next/core/feature/DummyProfile";

export const profileDataStoreSchema: DataStoreSchema<DummyProfile, "charaId"> =
  {
    name: "profiles",
    documentKey: "charaId",
    parse: parseDummyProfile
  };
