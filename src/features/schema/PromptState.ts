import {
  parseArray,
  parseObject,
  parseString
} from "~/common/lib/parser-helper";

export type SubjectItem = {
  id: string;
  label: string;
  value: string;
};

type PromptState = {
  subjectItems: SubjectItem[];
  subjectSelectedIds: string[];
  selectedIds: string[];
};

export const parsePromptState = (src: unknown) =>
  parseObject<PromptState>(
    src,
    ({ subjectItems, subjectSelectedIds, selectedIds }) => ({
      subjectItems: parseArray(subjectItems, v =>
        parseObject<SubjectItem>(v, ({ id, label, value }) => ({
          id: parseString(id),
          label: parseString(label),
          value: parseString(value)
        }))
      ),
      subjectSelectedIds: parseArray(subjectSelectedIds, parseString),
      selectedIds: parseArray(selectedIds, parseString)
    })
  );

export default PromptState;
