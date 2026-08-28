import { type DataStoreSchema } from "@hinagata-next/core/common/DataStoreAgent";
import type ProfilePost from "@hinagata-next/core/feature/ProfilePost";
import { parseProfilePost } from "@hinagata-next/core/feature/ProfilePost";

export const profileDataStoreSchema: DataStoreSchema<ProfilePost, "charaId"> =
  {
    name: "profiles",
    documentKey: "charaId",
    parse: parseProfilePost
  };
