import { create } from "zustand";
import { toggleArrayItem, uniq } from "~/common/lib/array-util";
import { type SubjectItem } from "~/features/schema/PromptState";
import type PromptState from "~/features/schema/PromptState";

type PromptStore = PromptState & {
  setSubjectItems: (items: SubjectItem[]) => void;
  setSubjectSelectedIds: (ids: string[]) => void;
  setSelectedIds: (ids: string[]) => void;
  addSubjectItem: (item: SubjectItem) => void;
  removeSubjectItem: (id: string) => void;
  moveSubjectItem: (fromIndex: number, toIndex: number) => void;
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

  removeSubjectItem: id =>
    set(state => ({
      subjectItems: state.subjectItems.filter(item => item.id !== id),
      subjectSelectedIds: state.subjectSelectedIds.filter(sid => sid !== id)
    })),

  moveSubjectItem: (fromIndex, toIndex) =>
    set(state => {
      const items = [...state.subjectItems];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return { subjectItems: items };
    }),

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
