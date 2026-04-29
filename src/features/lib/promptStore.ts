import { create } from "zustand";

type SubjectItem = {
  id: string;
  label: string;
  value: string;
};

type PromptStore = {
  subjectItems: SubjectItem[];
  subjectSelectedIds: Set<string>;
  selectedIds: Set<string>;
  setSubjectItems: (items: SubjectItem[]) => void;
  setSubjectSelectedIds: (ids: Set<string>) => void;
  setSelectedIds: (ids: Set<string>) => void;
  addSubjectItem: (item: SubjectItem) => void;
  toggleSubjectSelected: (id: string) => void;
  toggleSelected: (id: string) => void;
  clearAll: () => void;
};

const usePromptStore = create<PromptStore>(set => ({
  subjectItems: [],
  subjectSelectedIds: new Set(),
  selectedIds: new Set(),

  setSubjectItems: items => set({ subjectItems: items }),
  setSubjectSelectedIds: ids => set({ subjectSelectedIds: ids }),
  setSelectedIds: ids => set({ selectedIds: ids }),

  addSubjectItem: item =>
    set(state => ({
      subjectItems: [...state.subjectItems, item],
      subjectSelectedIds: new Set([...state.subjectSelectedIds, item.id])
    })),

  toggleSubjectSelected: id =>
    set(state => {
      const next = new Set(state.subjectSelectedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { subjectSelectedIds: next };
    }),

  toggleSelected: id =>
    set(state => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedIds: next };
    }),

  clearAll: () =>
    set({
      subjectItems: [],
      subjectSelectedIds: new Set(),
      selectedIds: new Set()
    })
}));

export default usePromptStore;
