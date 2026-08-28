import { type DataStoreSchema } from "@hinagata-next/core/common/DataStoreAgent";
import type ProfilePost from "@hinagata-next/core/feature/ProfilePost";
import { parseProfilePost } from "@hinagata-next/core/feature/ProfilePost";

export const profilePostDataStoreSchema: DataStoreSchema<
  ProfilePost,
  "postId"
> = {
  name: "profilePosts",
  documentKey: "postId",
  parse: parseProfilePost
};
