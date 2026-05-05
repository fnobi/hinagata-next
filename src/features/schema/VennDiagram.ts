export type VennRegion = "a" | "both" | "b";

export type VennKeyword = {
  id: string;
  text: string;
  region: VennRegion;
};

export type VennDiagramData = {
  groupAName: string;
  groupBName: string;
  keywords: VennKeyword[];
};

export const VENN_REGION_LABELS: Record<VennRegion, string> = {
  a: "グループA のみ",
  both: "共通",
  b: "グループB のみ"
};

export const defaultVennDiagramData = (): VennDiagramData => ({
  groupAName: "グループ A",
  groupBName: "グループ B",
  keywords: []
});
