import type { PromptCategory } from "~/features/schema/PromptItem";
import type { SubjectItem } from "~/features/schema/PromptState";

const buildPrompt = (
  subjectItems: SubjectItem[],
  subjectSelectedIds: string[],
  selectedIds: string[],
  categories: PromptCategory[]
): string => {
  const parts: string[] = [];
  for (const item of subjectItems) {
    if (subjectSelectedIds.includes(item.id)) {
      parts.push(item.value);
    }
  }
  for (const category of categories) {
    for (const item of category.items) {
      if (selectedIds.includes(item.id)) {
        parts.push(item.value);
      }
    }
  }
  return parts.join(", ");
};

export default buildPrompt;
