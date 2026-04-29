import { parseObject } from "~/common/lib/parser-helper";
import type PromptState from "~/features/schema/PromptState";
import { parsePromptState } from "~/features/schema/PromptState";

type MyPromptItem = { prompt: PromptState };

export const parseMyPromptItem = (src: unknown) =>
  parseObject<MyPromptItem>(src, ({ prompt }) => ({
    prompt: parsePromptState(prompt)
  }));

export default MyPromptItem;
