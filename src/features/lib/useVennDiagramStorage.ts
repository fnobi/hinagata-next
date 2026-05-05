"use client";

import { useState, useEffect, useCallback } from "react";
import type { VennDiagramData, VennKeyword, VennRegion } from "~/features/schema/VennDiagram";
import { defaultVennDiagramData } from "~/features/schema/VennDiagram";

const STORAGE_KEY = "venn-diagram-data";

const loadFromStorage = (): VennDiagramData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultVennDiagramData();
    return JSON.parse(raw) as VennDiagramData;
  } catch {
    return defaultVennDiagramData();
  }
};

const saveToStorage = (data: VennDiagramData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
};

const useVennDiagramStorage = () => {
  const [data, setData] = useState<VennDiagramData>(defaultVennDiagramData);

  useEffect(() => {
    setData(loadFromStorage());
  }, []);

  const update = useCallback((next: VennDiagramData) => {
    setData(next);
    saveToStorage(next);
  }, []);

  const setGroupAName = useCallback(
    (name: string) => update({ ...data, groupAName: name }),
    [data, update]
  );

  const setGroupBName = useCallback(
    (name: string) => update({ ...data, groupBName: name }),
    [data, update]
  );

  const addKeyword = useCallback(
    (text: string, region: VennRegion) => {
      const keyword: VennKeyword = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        text,
        region
      };
      update({ ...data, keywords: [...data.keywords, keyword] });
    },
    [data, update]
  );

  const moveKeyword = useCallback(
    (id: string, region: VennRegion) => {
      update({
        ...data,
        keywords: data.keywords.map(k => (k.id === id ? { ...k, region } : k))
      });
    },
    [data, update]
  );

  const deleteKeyword = useCallback(
    (id: string) => {
      update({ ...data, keywords: data.keywords.filter(k => k.id !== id) });
    },
    [data, update]
  );

  return {
    data,
    setGroupAName,
    setGroupBName,
    addKeyword,
    moveKeyword,
    deleteKeyword
  };
};

export default useVennDiagramStorage;
