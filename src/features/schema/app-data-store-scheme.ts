import type MyPromptItem from "./MyPromptItem";
import { parseMyPromptItem } from "./MyPromptItem";
import { type DataStoreScheme } from "~/common/lib/DataStoreAgent";
import type CommonPermission from "~/common/schema/CommonPermission";
import { parseCommonPermission } from "~/common/schema/CommonPermission";

export const playScoreDataStoreScheme: DataStoreScheme<
  CommonPermission,
  "userId"
> = {
  name: "profiles",
  parse: parseCommonPermission,
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
  parentCollection: playScoreDataStoreScheme
};
