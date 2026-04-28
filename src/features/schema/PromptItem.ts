export type PromptItem = {
  id: string;
  label: string;
  value: string;
  description: string;
};

export type PromptCategory = {
  id: string;
  label: string;
  items: PromptItem[];
};
