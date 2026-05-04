"use client";

import styled from "@emotion/styled";
import { useState, useRef, useCallback } from "react";
import { buttonReset, percent, px } from "~/common/lib/css-util";

type Keyword = {
  id: number;
  text: string;
  x: number;
  y: number;
};

type DragState = {
  keywordId: number;
  offsetX: number;
  offsetY: number;
};

const Canvas = styled.div({
  position: "fixed",
  inset: 0,
  overflow: "hidden",
  userSelect: "none",
  background: "#f8f7f4"
});

const QuadGrid = styled.div({
  position: "absolute",
  inset: 0,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridTemplateRows: "1fr 1fr",
  pointerEvents: "none"
});

const QuadCell = styled.div<{ bg: string }>(({ bg }) => ({
  backgroundColor: bg,
  position: "relative"
}));

const QuadLabel = styled.div<{
  vAlign: "top" | "bottom";
  hAlign: "left" | "right";
}>(({ vAlign, hAlign }) => ({
  position: "absolute",
  [vAlign]: px(16),
  [hAlign]: px(20),
  fontSize: px(11),
  fontWeight: 700,
  letterSpacing: "0.06em",
  color: "rgba(0,0,0,0.22)",
  textTransform: "uppercase"
}));

const DividerH = styled.div({
  position: "absolute",
  left: 0,
  right: 0,
  top: percent(50),
  height: px(1),
  backgroundColor: "rgba(0,0,0,0.18)",
  pointerEvents: "none"
});

const DividerV = styled.div({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: percent(50),
  width: px(1),
  backgroundColor: "rgba(0,0,0,0.18)",
  pointerEvents: "none"
});

const AxisLabelH = styled.div<{ side: "top" | "bottom" }>(({ side }) => ({
  position: "absolute",
  left: percent(50),
  [side]: px(20),
  transform: "translateX(-50%)",
  fontSize: px(12),
  fontWeight: 800,
  letterSpacing: "0.12em",
  color: "rgba(0,0,0,0.4)",
  pointerEvents: "none",
  textTransform: "uppercase"
}));

const AxisLabelV = styled.div<{ side: "left" | "right" }>(({ side }) => ({
  position: "absolute",
  top: percent(50),
  [side]: px(20),
  transform: `translateY(-50%) rotate(${side === "left" ? -90 : 90}deg)`,
  fontSize: px(12),
  fontWeight: 800,
  letterSpacing: "0.12em",
  color: "rgba(0,0,0,0.4)",
  pointerEvents: "none",
  textTransform: "uppercase"
}));

const GroupTagTop = styled.div({
  position: "absolute",
  left: percent(50),
  top: percent(50),
  transform: "translate(-50%, calc(-100% - 8px))",
  fontSize: px(10),
  fontWeight: 700,
  letterSpacing: "0.1em",
  color: "rgba(0,0,0,0.3)",
  pointerEvents: "none",
  backgroundColor: "rgba(255,255,255,0.7)",
  padding: px(2, 8),
  borderRadius: px(4)
});

const GroupTagBottom = styled(GroupTagTop)({
  transform: "translate(-50%, 8px)"
});

const KeywordChip = styled.div<{ isDragging: boolean }>(({ isDragging }) => ({
  position: "absolute",
  padding: px(7, 16),
  borderRadius: px(24),
  backgroundColor: "#fff",
  border: "1.5px solid #222",
  fontSize: px(14),
  fontWeight: 700,
  cursor: isDragging ? "grabbing" : "grab",
  boxShadow: isDragging
    ? "0 8px 24px rgba(0,0,0,0.2)"
    : "0 2px 8px rgba(0,0,0,0.1)",
  whiteSpace: "nowrap",
  transform: "translate(-50%, -50%)",
  transition: isDragging ? "none" : "box-shadow 0.15s",
  zIndex: isDragging ? 5 : 2,
  letterSpacing: "0.02em",
  touchAction: "none"
}));

const AddButton = styled.button(buttonReset, {
  position: "fixed",
  bottom: px(32),
  right: px(32),
  width: px(56),
  height: px(56),
  borderRadius: percent(50),
  backgroundColor: "#222",
  color: "#fff",
  fontSize: px(26),
  lineHeight: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
  cursor: "pointer",
  zIndex: 10,
  transition: "transform 0.12s, background 0.12s",
  "&:hover": {
    backgroundColor: "#444",
    transform: "scale(1.06)"
  },
  "&:active": {
    transform: "scale(0.96)"
  }
});

const Overlay = styled.div({
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 20
});

const InputBox = styled.div({
  backgroundColor: "#fff",
  borderRadius: px(14),
  padding: px(28, 28, 20),
  display: "flex",
  flexDirection: "column",
  gap: px(14),
  minWidth: px(300),
  boxShadow: "0 8px 40px rgba(0,0,0,0.2)"
});

const InputTitle = styled.p({
  margin: 0,
  fontSize: px(15),
  fontWeight: 800,
  letterSpacing: "0.04em",
  color: "#222"
});

const TextInput = styled.input({
  border: "1.5px solid #ddd",
  borderRadius: px(8),
  padding: px(9, 12),
  fontSize: px(16),
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.15s",
  "&:focus": {
    borderColor: "#222"
  },
  "&::placeholder": {
    color: "#bbb"
  }
});

const SubmitButton = styled.button(buttonReset, {
  backgroundColor: "#222",
  color: "#fff",
  borderRadius: px(8),
  padding: px(9, 16),
  fontSize: px(15),
  fontWeight: 700,
  cursor: "pointer",
  textAlign: "center",
  transition: "background 0.12s",
  "&:hover": {
    backgroundColor: "#444"
  },
  "&:disabled": {
    opacity: 0.4,
    pointerEvents: "none"
  }
});

const QUAD_COLORS = [
  "rgba(100, 140, 255, 0.07)", // A × 抽象 (top-left)
  "rgba(60,  200, 150, 0.07)", // A × 具体 (top-right)
  "rgba(255, 160,  80, 0.07)", // B × 抽象 (bottom-left)
  "rgba(200,  80, 200, 0.07)"  // B × 具体 (bottom-right)
];

const INITIAL_KEYWORDS: Keyword[] = [
  { id: 1, text: "自由", x: 180, y: 180 },
  { id: 2, text: "秩序", x: 180, y: 420 },
  { id: 3, text: "遊び", x: 560, y: 160 },
  { id: 4, text: "仕事", x: 560, y: 400 }
];

const IdeationScene = () => {
  const [keywords, setKeywords] = useState<Keyword[]>(INITIAL_KEYWORDS);
  const [dragging, setDragging] = useState<DragState | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState("");
  const canvasRef = useRef<HTMLDivElement>(null);

  const startDrag = useCallback(
    (clientX: number, clientY: number, id: number) => {
      const kw = keywords.find(k => k.id === id);
      if (!kw) return;
      setDragging({
        keywordId: id,
        offsetX: clientX - kw.x,
        offsetY: clientY - kw.y
      });
    },
    [keywords]
  );

  const moveDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!dragging) return;
      setKeywords(kws =>
        kws.map(k =>
          k.id === dragging.keywordId
            ? { ...k, x: clientX - dragging.offsetX, y: clientY - dragging.offsetY }
            : k
        )
      );
    },
    [dragging]
  );

  const endDrag = useCallback(() => {
    setDragging(null);
  }, []);

  const handleChipMouseDown = useCallback(
    (e: React.MouseEvent, id: number) => {
      e.preventDefault();
      e.stopPropagation();
      startDrag(e.clientX, e.clientY, id);
    },
    [startDrag]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => moveDrag(e.clientX, e.clientY),
    [moveDrag]
  );

  const handleChipTouchStart = useCallback(
    (e: React.TouchEvent, id: number) => {
      e.stopPropagation();
      const t = e.touches[0];
      startDrag(t.clientX, t.clientY, id);
    },
    [startDrag]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const t = e.touches[0];
      moveDrag(t.clientX, t.clientY);
    },
    [moveDrag]
  );

  const handleMouseUp = endDrag;

  const handleAdd = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    const canvas = canvasRef.current;
    const cx = canvas ? canvas.clientWidth / 2 : 400;
    const cy = canvas ? canvas.clientHeight / 2 : 300;
    setKeywords(kws => [
      ...kws,
      {
        id: Date.now(),
        text,
        x: cx + (Math.random() - 0.5) * 240,
        y: cy + (Math.random() - 0.5) * 160
      }
    ]);
    setInputText("");
    setShowInput(false);
  }, [inputText]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleAdd();
      if (e.key === "Escape") setShowInput(false);
    },
    [handleAdd]
  );

  return (
    <>
      <Canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={endDrag}
        onTouchCancel={endDrag}
      >
        {/* Quadrant backgrounds */}
        <QuadGrid>
          <QuadCell bg={QUAD_COLORS[0]}>
            <QuadLabel vAlign="top" hAlign="left">
              A × 抽象
            </QuadLabel>
          </QuadCell>
          <QuadCell bg={QUAD_COLORS[1]}>
            <QuadLabel vAlign="top" hAlign="right">
              A × 具体
            </QuadLabel>
          </QuadCell>
          <QuadCell bg={QUAD_COLORS[2]}>
            <QuadLabel vAlign="bottom" hAlign="left">
              B × 抽象
            </QuadLabel>
          </QuadCell>
          <QuadCell bg={QUAD_COLORS[3]}>
            <QuadLabel vAlign="bottom" hAlign="right">
              B × 具体
            </QuadLabel>
          </QuadCell>
        </QuadGrid>

        {/* Dividers */}
        <DividerH />
        <DividerV />

        {/* Axis labels */}
        <AxisLabelH side="top">グループ A</AxisLabelH>
        <AxisLabelH side="bottom">グループ B</AxisLabelH>
        <AxisLabelV side="left">抽象</AxisLabelV>
        <AxisLabelV side="right">具体</AxisLabelV>

        {/* Center cross tags */}
        <GroupTagTop>グループ A</GroupTagTop>
        <GroupTagBottom>グループ B</GroupTagBottom>

        {/* Keywords */}
        {keywords.map(kw => (
          <KeywordChip
            key={kw.id}
            isDragging={dragging?.keywordId === kw.id}
            style={{ left: kw.x, top: kw.y }}
            onMouseDown={e => handleChipMouseDown(e, kw.id)}
            onTouchStart={e => handleChipTouchStart(e, kw.id)}
          >
            {kw.text}
          </KeywordChip>
        ))}
      </Canvas>

      {/* FAB */}
      <AddButton onClick={() => setShowInput(true)}>＋</AddButton>

      {/* Add keyword dialog */}
      {showInput && (
        <Overlay
          onClick={() => {
            setShowInput(false);
            setInputText("");
          }}
        >
          <InputBox onClick={e => e.stopPropagation()}>
            <InputTitle>キーワードを追加</InputTitle>
            <TextInput
              autoFocus
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="例: 自由、孤独、リズム…"
            />
            <SubmitButton disabled={!inputText.trim()} onClick={handleAdd}>
              追加する
            </SubmitButton>
          </InputBox>
        </Overlay>
      )}
    </>
  );
};

export default IdeationScene;
