import { create } from "zustand";
import { toggleArrayItem, uniq } from "~/common/lib/array-util";

type SubjectItem = {
  id: string;
  label: string;
  value: string;
};

type PromptStore = {
  subjectItems: SubjectItem[];
  subjectSelectedIds: string[];
  selectedIds: string[];
  setSubjectItems: (items: SubjectItem[]) => void;
  setSubjectSelectedIds: (ids: string[]) => void;
  setSelectedIds: (ids: string[]) => void;
  addSubjectItem: (item: SubjectItem) => void;
  toggleSubjectSelected: (id: string) => void;
  toggleSelected: (id: string) => void;
  clearAll: () => void;
};

const usePromptStore = create<PromptStore>(set => ({
  subjectItems: [],
  subjectSelectedIds: [],
  selectedIds: [],

  setSubjectItems: items => set({ subjectItems: items }),
  setSubjectSelectedIds: ids => set({ subjectSelectedIds: ids }),
  setSelectedIds: ids => set({ selectedIds: ids }),

  addSubjectItem: item =>
    set(state => ({
      subjectItems: [...state.subjectItems, item],
      subjectSelectedIds: uniq([...state.subjectSelectedIds, item.id])
    })),

  toggleSubjectSelected: id =>
    set(state => ({
      subjectSelectedIds: toggleArrayItem(
        state.subjectSelectedIds,
        id,
        !state.subjectSelectedIds.includes(id)
      )
    })),

  toggleSelected: id =>
    set(state => ({
      selectedIds: toggleArrayItem(
        state.selectedIds,
        id,
        !state.selectedIds.includes(id)
      )
    })),

  clearAll: () =>
    set({
      subjectItems: [],
      subjectSelectedIds: [],
      selectedIds: []
    })
}));

export default usePromptStore;
