import { parseNumber, parseObject } from "~/common/lib/parser-helper";
import type PromptState from "~/features/schema/PromptState";
import { parsePromptState } from "~/features/schema/PromptState";

type MyPromptItem = { prompt: PromptState; createdAt: number };

export const parseMyPromptItem = (src: unknown) =>
  parseObject<MyPromptItem>(src, ({ prompt, createdAt }) => ({
    prompt: parsePromptState(prompt),
    createdAt: parseNumber(createdAt)
  }));

export default MyPromptItem;
