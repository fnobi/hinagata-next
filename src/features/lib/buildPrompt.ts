import PROMPT_CATEGORIES from "~/features/lib/promptData";
import type PromptState from "~/features/schema/PromptState";

const buildPrompt = ({ subjectItems, subjectSelectedIds, selectedIds }: PromptState): string => {
  const parts: string[] = [];
  for (const item of subjectItems) {
    if (subjectSelectedIds.includes(item.id)) {
      parts.push(item.value);
    }
  }
  for (const category of PROMPT_CATEGORIES) {
    for (const item of category.items) {
      if (selectedIds.includes(item.id)) {
        parts.push(item.value);
      }
    }
  }
  return parts.join(", ");
};

export default buildPrompt;
