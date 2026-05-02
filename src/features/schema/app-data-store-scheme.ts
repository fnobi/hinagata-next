import { type DataStoreScheme } from "~/common/lib/DataStoreAgent";
import type MyPromptItem from "~/features/schema/MyPromptItem";
import { parseMyPromptItem } from "~/features/schema/MyPromptItem";
import type DummyProfile from "~/features/schema/DummyProfile";
import { parseDummyProfile } from "~/features/schema/DummyProfile";

export const profileDataStoreScheme: DataStoreScheme<DummyProfile, "userId"> = {
  name: "profiles",
  parse: parseDummyProfile,
  documentKey: "userId"
};

export const myPromptDataStoreScheme: DataStoreScheme<
  MyPromptItem,
  "promptId",
  "userId"
> = {
  name: "myPrompts",
  parse: parseMyPromptItem,
  documentKey: "promptId",
  parentCollection: profileDataStoreScheme
};
