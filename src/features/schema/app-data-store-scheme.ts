import { type DataStoreScheme } from "~/common/lib/DataStoreAgent";
import type CommonPermission from "~/common/schema/CommonPermission";
import { parseCommonPermission } from "~/common/schema/CommonPermission";
import { parsePromptState } from "~/features/schema/PromptState";
import type PromptState from "~/features/schema/PromptState";

export const playScoreDataStoreScheme: DataStoreScheme<
  CommonPermission,
  "userId"
> = {
  name: "profiles",
  parse: parseCommonPermission,
  documentKey: "userId"
};

export const myPromptDataStoreScheme: DataStoreScheme<
  PromptState,
  "promptId",
  "userId"
> = {
  name: "myPrompts",
  parse: parsePromptState,
  documentKey: "promptId",
  parentCollection: playScoreDataStoreScheme
};
