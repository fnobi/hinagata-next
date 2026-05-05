"use client";

import styled from "@emotion/styled";
import { useState, useRef, useCallback } from "react";
import useVennDiagramStorage from "~/features/lib/useVennDiagramStorage";
import type { VennRegion } from "~/features/schema/VennDiagram";
import VennKeywordChip from "~/features/components/venn/VennKeywordChip";

// Layout constants (vw-based for mobile responsiveness)
// Two circles of radius 44vw, centered at x=50vw
// Circle A center: y=47vw, Circle B center: y=97vw
// Overlap: y=53vw to y=91vw  (overlap depth = 38vw)
const R = 44; // vw
const CY_A = 47; // vw
const CY_B = 97; // vw
const OVERLAP_TOP = CY_B - R; // 53vw
const OVERLAP_BOT = CY_A + R; // 91vw
const TOTAL_H = CY_B + R; // 141vw


const Wrapper = styled.div({
  minHeight: "100dvh",
  background: "linear-gradient(160deg, #f0f4ff 0%, #fdf0f8 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "16px 0 40px"
});

const Title = styled.h1({
  fontSize: 18,
  fontWeight: 700,
  color: "#444",
  marginBottom: 20,
  letterSpacing: 0.5
});

const DiagramContainer = styled.div({
  position: "relative",
  width: "100%",
  maxWidth: 480
});

const SvgBg = styled.svg({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none"
});

const RegionArea = styled.div<{ region: VennRegion; isOver: boolean }>(
  ({ region, isOver }) => ({
    position: "absolute",
    left: 0,
    right: 0,
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    padding: "10px 12px",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderRadius: 8,
    transition: "background 0.2s",
    background: isOver ? "rgba(255,255,255,0.35)" : "transparent"
  })
);

const AddHint = styled.span({
  fontSize: 12,
  color: "rgba(100,100,140,0.6)",
  userSelect: "none"
});

const GroupNameRow = styled.div({
  width: "100%",
  maxWidth: 480,
  display: "flex",
  gap: 12,
  marginBottom: 12,
  padding: "0 16px"
});

const GroupNameInput = styled.input<{ accent: string }>(({ accent }) => ({
  flex: 1,
  border: `2px solid ${accent}`,
  borderRadius: 8,
  padding: "6px 10px",
  fontSize: 14,
  fontWeight: 700,
  color: "#333",
  background: "rgba(255,255,255,0.8)",
  outline: "none",
  textAlign: "center"
}));

const GroupLabel = styled.div<{ color: string }>(({ color }) => ({
  fontSize: 13,
  fontWeight: 700,
  color,
  letterSpacing: 0.5,
  pointerEvents: "none",
  userSelect: "none"
}));

// Modal
const ModalOverlay = styled.div({
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  zIndex: 100
});

const ModalSheet = styled.div({
  background: "#fff",
  borderRadius: "20px 20px 0 0",
  padding: "24px 20px 40px",
  width: "100%",
  maxWidth: 480
});

const ModalTitle = styled.p({
  fontSize: 14,
  color: "#888",
  marginBottom: 12,
  textAlign: "center"
});

const ModalInput = styled.input({
  width: "100%",
  border: "2px solid #ccc",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 16,
  outline: "none",
  marginBottom: 12,
  boxSizing: "border-box",
  "&:focus": { borderColor: "#8880ff" }
});

const ModalButton = styled.button({
  width: "100%",
  padding: "12px",
  borderRadius: 10,
  border: "none",
  background: "linear-gradient(90deg,#7b8fff,#c07bff)",
  color: "#fff",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer"
});

const DragGhost = styled.div({
  position: "fixed",
  pointerEvents: "none",
  zIndex: 200,
  padding: "4px 10px",
  borderRadius: 20,
  background: "rgba(120,100,255,0.9)",
  color: "#fff",
  fontSize: 13,
  fontWeight: 600,
  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  transform: "translate(-50%,-50%)"
});

type DragState = {
  id: string;
  text: string;
  x: number;
  y: number;
};

const VennDiagramScene = () => {
  const { data, setGroupAName, setGroupBName, addKeyword, moveKeyword, deleteKeyword } =
    useVennDiagramStorage();

  const [addingRegion, setAddingRegion] = useState<VennRegion | null>(null);
  const [inputText, setInputText] = useState("");
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [overRegion, setOverRegion] = useState<VennRegion | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const regionRefs = useRef<Partial<Record<VennRegion, HTMLDivElement>>>({});

  // Convert clientY to vw units relative to container
  const getRegionFromPoint = useCallback((x: number, y: number): VennRegion | null => {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    const region = (el as HTMLElement).dataset?.region as VennRegion | undefined;
    if (region) return region;
    // Walk up to find data-region
    const parent = (el as HTMLElement).closest("[data-region]");
    if (parent) return (parent as HTMLElement).dataset.region as VennRegion;
    return null;
  }, []);

  const handleDragStart = useCallback(
    (id: string) => {
      const kw = data.keywords.find(k => k.id === id);
      if (!kw) return;
      setDragState({ id, text: kw.text, x: 0, y: 0 });
    },
    [data.keywords]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!dragState) return;
      const t = e.touches[0];
      setDragState(s => (s ? { ...s, x: t.clientX, y: t.clientY } : null));
      const region = getRegionFromPoint(t.clientX, t.clientY);
      setOverRegion(region);
    },
    [dragState, getRegionFromPoint]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragState) return;
      setDragState(s => (s ? { ...s, x: e.clientX, y: e.clientY } : null));
      const region = getRegionFromPoint(e.clientX, e.clientY);
      setOverRegion(region);
    },
    [dragState, getRegionFromPoint]
  );

  const handleDragEnd = useCallback(
    (id: string, x: number, y: number) => {
      const region = getRegionFromPoint(x, y);
      if (region) moveKeyword(id, region);
      setDragState(null);
      setOverRegion(null);
    },
    [getRegionFromPoint, moveKeyword]
  );

  const handleRegionClick = useCallback(
    (region: VennRegion) => {
      if (dragState) return;
      setAddingRegion(region);
      setInputText("");
    },
    [dragState]
  );

  const handleAddSubmit = useCallback(() => {
    if (!inputText.trim() || !addingRegion) return;
    addKeyword(inputText.trim(), addingRegion);
    setAddingRegion(null);
    setInputText("");
  }, [inputText, addingRegion, addKeyword]);

  const keywordsByRegion = useCallback(
    (r: VennRegion) => data.keywords.filter(k => k.region === r),
    [data.keywords]
  );

  // vw to % string helper (same value, just for SVG viewBox)
  const vbH = TOTAL_H;

  return (
    <Wrapper
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseUp={() => {
        setDragState(null);
        setOverRegion(null);
      }}
    >
      <Title>ベン図アイデア整理</Title>

      <GroupNameRow>
        <GroupNameInput
          accent="rgba(80,120,220,0.7)"
          value={data.groupAName}
          onChange={e => setGroupAName(e.target.value)}
          placeholder="グループ A"
        />
        <GroupNameInput
          accent="rgba(220,100,80,0.7)"
          value={data.groupBName}
          onChange={e => setGroupBName(e.target.value)}
          placeholder="グループ B"
        />
      </GroupNameRow>

      <DiagramContainer
        ref={containerRef}
        style={{ paddingBottom: `${vbH}%` }}
      >
        {/* SVG background circles */}
        <SvgBg viewBox={`0 0 100 ${vbH}`} preserveAspectRatio="none">
          <defs>
            <clipPath id="clip-a-only">
              <circle cx="50" cy={CY_A} r={R} />
            </clipPath>
            <clipPath id="clip-b-only">
              <circle cx="50" cy={CY_B} r={R} />
            </clipPath>
          </defs>
          {/* Circle A fill */}
          <circle
            cx="50"
            cy={CY_A}
            r={R}
            fill="rgba(100,140,255,0.12)"
            stroke="rgba(80,120,220,0.45)"
            strokeWidth="0.8"
          />
          {/* Circle B fill */}
          <circle
            cx="50"
            cy={CY_B}
            r={R}
            fill="rgba(255,130,100,0.12)"
            stroke="rgba(200,90,70,0.45)"
            strokeWidth="0.8"
          />
          {/* Intersection highlight */}
          <rect
            x="0"
            y={OVERLAP_TOP}
            width="100"
            height={OVERLAP_BOT - OVERLAP_TOP}
            fill="rgba(140,100,255,0.1)"
            clipPath="url(#clip-a-only)"
          />
        </SvgBg>

        {/* Group A label */}
        <div
          style={{
            position: "absolute",
            top: `${(CY_A - R + 2) / vbH * 100}%`,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none"
          }}
        >
          <GroupLabel color="rgba(60,100,200,0.9)">{data.groupAName}</GroupLabel>
        </div>

        {/* Group B label */}
        <div
          style={{
            position: "absolute",
            top: `${(CY_B + R - 10) / vbH * 100}%`,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none"
          }}
        >
          <GroupLabel color="rgba(200,80,60,0.9)">{data.groupBName}</GroupLabel>
        </div>

        {/* Region A-only */}
        <RegionArea
          data-region="a"
          region="a"
          isOver={overRegion === "a"}
          ref={el => { if (el) regionRefs.current.a = el; }}
          style={{
            top: `${(CY_A - R + 14) / vbH * 100}%`,
            height: `${(OVERLAP_TOP - (CY_A - R + 14)) / vbH * 100}%`
          }}
          onClick={() => handleRegionClick("a")}
        >
          {keywordsByRegion("a").map(kw => (
            <VennKeywordChip
              key={kw.id}
              id={kw.id}
              text={kw.text}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDelete={deleteKeyword}
            />
          ))}
          {keywordsByRegion("a").length === 0 && (
            <AddHint>タップしてキーワードを追加</AddHint>
          )}
        </RegionArea>

        {/* Region Intersection */}
        <RegionArea
          data-region="both"
          region="both"
          isOver={overRegion === "both"}
          ref={el => { if (el) regionRefs.current.both = el; }}
          style={{
            top: `${OVERLAP_TOP / vbH * 100}%`,
            height: `${(OVERLAP_BOT - OVERLAP_TOP) / vbH * 100}%`
          }}
          onClick={() => handleRegionClick("both")}
        >
          {keywordsByRegion("both").map(kw => (
            <VennKeywordChip
              key={kw.id}
              id={kw.id}
              text={kw.text}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDelete={deleteKeyword}
            />
          ))}
          {keywordsByRegion("both").length === 0 && (
            <AddHint>共通領域</AddHint>
          )}
        </RegionArea>

        {/* Region B-only */}
        <RegionArea
          data-region="b"
          region="b"
          isOver={overRegion === "b"}
          ref={el => { if (el) regionRefs.current.b = el; }}
          style={{
            top: `${OVERLAP_BOT / vbH * 100}%`,
            height: `${(CY_B + R - 14 - OVERLAP_BOT) / vbH * 100}%`
          }}
          onClick={() => handleRegionClick("b")}
        >
          {keywordsByRegion("b").map(kw => (
            <VennKeywordChip
              key={kw.id}
              id={kw.id}
              text={kw.text}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDelete={deleteKeyword}
            />
          ))}
          {keywordsByRegion("b").length === 0 && (
            <AddHint>タップしてキーワードを追加</AddHint>
          )}
        </RegionArea>
      </DiagramContainer>

      {/* Drag ghost */}
      {dragState && dragState.x !== 0 && (
        <DragGhost style={{ left: dragState.x, top: dragState.y }}>
          {dragState.text}
        </DragGhost>
      )}

      {/* Add keyword modal */}
      {addingRegion && (
        <ModalOverlay onClick={() => setAddingRegion(null)}>
          <ModalSheet onClick={e => e.stopPropagation()}>
            <ModalTitle>
              「
              {addingRegion === "a"
                ? data.groupAName
                : addingRegion === "b"
                  ? data.groupBName
                  : "共通"}
              」にキーワードを追加
            </ModalTitle>
            <ModalInput
              autoFocus
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="キーワードを入力..."
              onKeyDown={e => {
                if (e.key === "Enter") handleAddSubmit();
                if (e.key === "Escape") setAddingRegion(null);
              }}
            />
            <ModalButton onClick={handleAddSubmit}>追加する</ModalButton>
          </ModalSheet>
        </ModalOverlay>
      )}
    </Wrapper>
  );
};

export default VennDiagramScene;
