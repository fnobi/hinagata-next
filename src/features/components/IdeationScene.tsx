"use client";

import styled from "@emotion/styled";
import { useState, useRef, useCallback, useEffect } from "react";
import { buttonReset, px } from "~/common/lib/css-util";

type Row = {
  id: number;
  keywordA: string[];
  keywordB: string[];
};

type DragState = {
  fromId: number;
  dropIndex: number;
};

type CellEditState = {
  rowId: number;
  side: "A" | "B";
  draft: string[];
  inputValue: string;
};

type ChipDragState = {
  fromRowId: number;
  fromSide: "A" | "B";
  fromIndex: number;
  keyword: string;
  x: number;
  y: number;
  targetRowId: number | null;
  targetSide: "A" | "B" | null;
};

const INITIAL_ROWS: Row[] = [
  { id: 1, keywordA: ["自由"], keywordB: ["秩序"] },
  { id: 2, keywordA: ["遊び"], keywordB: ["仕事"] },
  { id: 3, keywordA: ["夢"], keywordB: ["現実"] }
];

const STORAGE_KEY = "ideation-data";

type StoredData = { rows: Row[]; labelA: string; labelB: string };

const loadStored = (): StoredData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        rows: p.rows ?? INITIAL_ROWS,
        labelA: p.labelA ?? "グループ A",
        labelB: p.labelB ?? "グループ B"
      };
    }
  } catch {}
  return { rows: INITIAL_ROWS, labelA: "グループ A", labelB: "グループ B" };
};

const GRID_COLS = "40px 1fr 1fr";

// ──────────────────────────────────────────────────────────────
// Styled components
// ──────────────────────────────────────────────────────────────

const Root = styled.div({
  display: "flex",
  flexDirection: "column",
  height: "100dvh",
  background: "#f8f7f4",
  overflow: "hidden"
});

const ColHeader = styled.div({
  display: "grid",
  gridTemplateColumns: GRID_COLS,
  borderBottom: "1.5px solid rgba(0,0,0,0.13)",
  background: "#fff",
  flexShrink: 0
});

const ColHeaderCell = styled.div<{ borderLeft?: boolean }>(
  ({ borderLeft }) => ({
    display: "flex",
    alignItems: "center",
    borderLeft: borderLeft ? "1px solid rgba(0,0,0,0.1)" : "none",
    minWidth: 0
  })
);

const ColHeaderLabel = styled.button(buttonReset, {
  flex: 1,
  padding: px(13, 16),
  fontSize: px(11),
  fontWeight: 800,
  letterSpacing: "0.12em",
  color: "rgba(0,0,0,0.38)",
  textAlign: "left",
  cursor: "text",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  "&:hover": { color: "rgba(0,0,0,0.6)" }
});

const ColHeaderInput = styled.input({
  flex: 1,
  padding: px(13, 16),
  fontSize: px(11),
  fontWeight: 800,
  letterSpacing: "0.12em",
  color: "#222",
  border: "none",
  outline: "none",
  background: "rgba(0,0,0,0.04)",
  fontFamily: "inherit",
  minWidth: 0
});

const RowList = styled.div({
  flex: 1,
  overflowY: "auto",
  WebkitOverflowScrolling: "touch"
});

const RowWrap = styled.div<{ faded: boolean; dropLineBefore: boolean }>(
  ({ faded, dropLineBefore }) => ({
    opacity: faded ? 0.28 : 1,
    position: "relative",
    "&::before": dropLineBefore
      ? {
          content: '""',
          position: "absolute",
          top: -1,
          left: px(40),
          right: 0,
          height: px(2),
          background: "#222",
          zIndex: 3,
          pointerEvents: "none"
        }
      : {}
  })
);

const RowGrid = styled.div({
  display: "grid",
  gridTemplateColumns: GRID_COLS,
  alignItems: "stretch",
  borderBottom: "1px solid rgba(0,0,0,0.07)",
  background: "#fff",
  minHeight: px(54)
});

const Handle = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgba(0,0,0,0.2)",
  fontSize: px(16),
  cursor: "grab",
  touchAction: "none",
  userSelect: "none",
  "&:active": { cursor: "grabbing" }
});

const KeyCell = styled.div<{ borderLeft?: boolean; isDropTarget?: boolean }>(
  ({ borderLeft, isDropTarget }) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: px(8),
    padding: px(10, 8, 10, 14),
    borderLeft: borderLeft ? "1px solid rgba(0,0,0,0.1)" : "none",
    minWidth: 0,
    transition: "background 0.1s",
    background: isDropTarget ? "rgba(100,140,255,0.1)" : "transparent",
    outline: isDropTarget ? `2px solid rgba(100,140,255,0.5)` : "none",
    outlineOffset: "-2px"
  })
);

const ChipsArea = styled.div({
  flex: 1,
  display: "flex",
  flexWrap: "wrap",
  gap: px(5),
  paddingTop: px(3),
  minWidth: 0
});

const Chip = styled.span({
  display: "inline-flex",
  alignItems: "center",
  padding: px(4, 10),
  borderRadius: px(14),
  background: "rgba(0,0,0,0.07)",
  fontSize: px(13),
  fontWeight: 600,
  color: "#333",
  lineHeight: 1.3,
  whiteSpace: "nowrap",
  cursor: "grab",
  touchAction: "none",
  userSelect: "none",
  "&:active": { cursor: "grabbing" }
});

const GhostChip = styled.div({
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  padding: px(4, 10),
  borderRadius: px(14),
  background: "#222",
  color: "#fff",
  fontSize: px(13),
  fontWeight: 600,
  lineHeight: 1.3,
  whiteSpace: "nowrap",
  transform: "translate(-50%, -50%)",
  boxShadow: "0 4px 16px rgba(0,0,0,0.3)"
});

const CellEditBtn = styled.button(buttonReset, {
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: px(32),
  height: px(32),
  borderRadius: px(6),
  color: "rgba(0,0,0,0.22)",
  fontSize: px(15),
  cursor: "pointer",
  marginTop: px(1),
  "&:hover": { color: "#222", background: "rgba(0,0,0,0.05)" },
  "&:active": { background: "rgba(0,0,0,0.09)" }
});

const TrailingDropLine = styled.div({
  height: px(2),
  background: "#222",
  marginLeft: px(40)
});

const Fab = styled.button(buttonReset, {
  position: "fixed",
  bottom: px(32),
  right: px(32),
  width: px(56),
  height: px(56),
  borderRadius: "50%",
  background: "#222",
  color: "#fff",
  fontSize: px(26),
  lineHeight: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
  zIndex: 10,
  "&:active": { transform: "scale(0.94)" }
});

const Overlay = styled.div({
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  zIndex: 20
});

const Sheet = styled.div({
  background: "#fff",
  borderRadius: px(16, 16, 0, 0),
  padding: px(28, 24, 48),
  width: "100%",
  maxWidth: px(640),
  display: "flex",
  flexDirection: "column",
  gap: px(18)
});

const SheetTitle = styled.p({
  margin: 0,
  fontSize: px(16),
  fontWeight: 800,
  color: "#222"
});

const DraftChipList = styled.div({
  display: "flex",
  flexWrap: "wrap",
  gap: px(8),
  minHeight: px(36)
});

const DraftChip = styled.span({
  display: "inline-flex",
  alignItems: "center",
  gap: px(2),
  padding: px(5, 4, 5, 12),
  borderRadius: px(16),
  background: "rgba(0,0,0,0.07)",
  fontSize: px(14),
  fontWeight: 600,
  color: "#333"
});

const RemoveChipBtn = styled.button(buttonReset, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: px(22),
  height: px(22),
  borderRadius: "50%",
  fontSize: px(12),
  color: "rgba(0,0,0,0.35)",
  cursor: "pointer",
  "&:hover": { background: "rgba(0,0,0,0.1)", color: "#222" }
});

const AddKwRow = styled.form({
  display: "flex",
  gap: px(8)
});

const Input = styled.input({
  flex: 1,
  border: "1.5px solid #ddd",
  borderRadius: px(8),
  padding: px(11, 12),
  fontSize: px(16),
  fontFamily: "inherit",
  outline: "none",
  "&:focus": { borderColor: "#222" },
  "&::placeholder": { color: "#ccc" }
});

const AddKwBtn = styled.button(buttonReset, {
  flexShrink: 0,
  padding: px(11, 16),
  borderRadius: px(8),
  background: "#f0f0ee",
  fontSize: px(14),
  fontWeight: 700,
  color: "#444",
  cursor: "pointer",
  "&:hover": { background: "#e4e4e0" }
});

const Actions = styled.div({
  display: "flex",
  gap: px(8),
  marginTop: px(4)
});

const SaveBtn = styled.button(buttonReset, {
  flex: 1,
  padding: px(12, 0),
  background: "#222",
  color: "#fff",
  borderRadius: px(8),
  fontSize: px(15),
  fontWeight: 700,
  textAlign: "center",
  cursor: "pointer"
});

const CancelBtn = styled.button(buttonReset, {
  padding: px(12, 16),
  border: "1.5px solid rgba(0,0,0,0.18)",
  borderRadius: px(8),
  fontSize: px(15),
  fontWeight: 600,
  color: "rgba(0,0,0,0.5)",
  cursor: "pointer"
});

const DeleteBtn = styled.button(buttonReset, {
  padding: px(12, 16),
  border: "1.5px solid rgba(200,50,50,0.3)",
  borderRadius: px(8),
  fontSize: px(15),
  fontWeight: 600,
  color: "rgba(200,50,50,0.8)",
  cursor: "pointer"
});

// ──────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────

const IdeationScene = () => {
  const [rows, setRows] = useState<Row[]>(() => loadStored().rows);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [cellEdit, setCellEdit] = useState<CellEditState | null>(null);
  const [chipDrag, setChipDrag] = useState<ChipDragState | null>(null);
  const [labelA, setLabelA] = useState(() => loadStored().labelA);
  const [labelB, setLabelB] = useState(() => loadStored().labelB);
  const [editingHeader, setEditingHeader] = useState<"A" | "B" | null>(null);
  const [headerDraft, setHeaderDraft] = useState("");
  const rowEls = useRef<Map<number, HTMLDivElement>>(new Map());
  // key: `${rowId}-${"A"|"B"}`
  const cellEls = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ rows, labelA, labelB }));
    } catch {}
  }, [rows, labelA, labelB]);

  // ── Header editing ────────────────────────────────────────
  const startEditHeader = useCallback(
    (which: "A" | "B") => {
      setHeaderDraft(which === "A" ? labelA : labelB);
      setEditingHeader(which);
    },
    [labelA, labelB]
  );

  const commitHeader = useCallback(() => {
    const v = headerDraft.trim();
    if (editingHeader === "A") setLabelA(v || "グループ A");
    if (editingHeader === "B") setLabelB(v || "グループ B");
    setEditingHeader(null);
  }, [editingHeader, headerDraft]);

  // ── Row drag-to-reorder ───────────────────────────────────
  const dropIndexAt = useCallback(
    (clientY: number) => {
      for (let i = 0; i < rows.length; i++) {
        const el = rowEls.current.get(rows[i].id);
        if (!el) continue;
        const { top, height } = el.getBoundingClientRect();
        if (clientY < top + height / 2) return i;
      }
      return rows.length;
    },
    [rows]
  );

  const onHandleDown = useCallback(
    (e: React.PointerEvent, id: number) => {
      e.preventDefault();
      e.stopPropagation();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setDrag({ fromId: id, dropIndex: rows.findIndex(r => r.id === id) });
    },
    [rows]
  );

  const onHandleMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drag) return;
      setDrag(d => (d ? { ...d, dropIndex: dropIndexAt(e.clientY) } : null));
    },
    [drag, dropIndexAt]
  );

  const onHandleUp = useCallback(() => {
    if (!drag) return;
    const { fromId, dropIndex } = drag;
    setRows(prev => {
      const fi = prev.findIndex(r => r.id === fromId);
      if (fi < 0) return prev;
      const next = [...prev];
      const [row] = next.splice(fi, 1);
      next.splice(dropIndex > fi ? dropIndex - 1 : dropIndex, 0, row);
      return next;
    });
    setDrag(null);
  }, [drag]);

  // ── Chip drag-to-move ─────────────────────────────────────
  const getTargetCell = useCallback(
    (clientX: number, clientY: number): { rowId: number; side: "A" | "B" } | null => {
      for (const [key, el] of cellEls.current) {
        const { left, right, top, bottom } = el.getBoundingClientRect();
        if (clientX >= left && clientX <= right && clientY >= top && clientY <= bottom) {
          const dash = key.indexOf("-");
          return { rowId: Number(key.slice(0, dash)), side: key.slice(dash + 1) as "A" | "B" };
        }
      }
      return null;
    },
    []
  );

  const startChipDrag = useCallback(
    (e: React.PointerEvent, rowId: number, side: "A" | "B", index: number, keyword: string) => {
      e.preventDefault();
      e.stopPropagation();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setChipDrag({
        fromRowId: rowId,
        fromSide: side,
        fromIndex: index,
        keyword,
        x: e.clientX,
        y: e.clientY,
        targetRowId: null,
        targetSide: null
      });
    },
    []
  );

  const handleChipMove = useCallback(
    (e: React.PointerEvent) => {
      if (!chipDrag) return;
      const target = getTargetCell(e.clientX, e.clientY);
      setChipDrag(s =>
        s
          ? {
              ...s,
              x: e.clientX,
              y: e.clientY,
              targetRowId: target?.rowId ?? null,
              targetSide: target?.side ?? null
            }
          : null
      );
    },
    [chipDrag, getTargetCell]
  );

  const handleChipUp = useCallback(() => {
    if (!chipDrag) return;
    const { fromRowId, fromSide, fromIndex, keyword, targetRowId, targetSide } = chipDrag;
    setChipDrag(null);

    if (
      targetRowId === null ||
      targetSide === null ||
      (targetRowId === fromRowId && targetSide === fromSide)
    ) {
      return;
    }

    setRows(prev =>
      prev.map(r => {
        let updated = { ...r };
        if (r.id === fromRowId) {
          const arr = (fromSide === "A" ? updated.keywordA : updated.keywordB).filter(
            (_, i) => i !== fromIndex
          );
          updated = fromSide === "A" ? { ...updated, keywordA: arr } : { ...updated, keywordB: arr };
        }
        if (r.id === targetRowId) {
          const arr = [...(targetSide === "A" ? updated.keywordA : updated.keywordB), keyword];
          updated = targetSide === "A" ? { ...updated, keywordA: arr } : { ...updated, keywordB: arr };
        }
        return updated;
      })
    );
  }, [chipDrag]);

  // ── Row operations ────────────────────────────────────────
  const addRow = useCallback(() => {
    setRows(prev => [...prev, { id: Date.now(), keywordA: [], keywordB: [] }]);
  }, []);

  // ── Cell editing ──────────────────────────────────────────
  const openCellEdit = useCallback(
    (rowId: number, side: "A" | "B") => {
      const row = rows.find(r => r.id === rowId);
      if (!row) return;
      setCellEdit({
        rowId,
        side,
        draft: side === "A" ? [...row.keywordA] : [...row.keywordB],
        inputValue: ""
      });
    },
    [rows]
  );

  const addDraftKeyword = useCallback(() => {
    if (!cellEdit) return;
    const kw = cellEdit.inputValue.trim();
    if (!kw) return;
    setCellEdit(s => (s ? { ...s, draft: [...s.draft, kw], inputValue: "" } : s));
  }, [cellEdit]);

  const removeDraftKeyword = useCallback((index: number) => {
    setCellEdit(s => (s ? { ...s, draft: s.draft.filter((_, i) => i !== index) } : s));
  }, []);

  const saveCellEdit = useCallback(() => {
    if (!cellEdit) return;
    const { rowId, side, draft } = cellEdit;
    setRows(prev =>
      prev.map(r =>
        r.id === rowId
          ? side === "A"
            ? { ...r, keywordA: draft }
            : { ...r, keywordB: draft }
          : r
      )
    );
    setCellEdit(null);
  }, [cellEdit]);

  const deleteRow = useCallback(() => {
    if (!cellEdit) return;
    setRows(prev => prev.filter(r => r.id !== cellEdit.rowId));
    setCellEdit(null);
  }, [cellEdit]);

  const closeEdit = useCallback(() => setCellEdit(null), []);

  return (
    <Root>
      {/* ── Column headers ───────────────────────────────── */}
      <ColHeader>
        <div />
        <ColHeaderCell>
          {editingHeader === "A" ? (
            <ColHeaderInput
              autoFocus
              value={headerDraft}
              onChange={e => setHeaderDraft(e.target.value)}
              onBlur={commitHeader}
              onKeyDown={e => e.key === "Enter" && commitHeader()}
            />
          ) : (
            <ColHeaderLabel onClick={() => startEditHeader("A")}>{labelA}</ColHeaderLabel>
          )}
        </ColHeaderCell>
        <ColHeaderCell borderLeft>
          {editingHeader === "B" ? (
            <ColHeaderInput
              autoFocus
              value={headerDraft}
              onChange={e => setHeaderDraft(e.target.value)}
              onBlur={commitHeader}
              onKeyDown={e => e.key === "Enter" && commitHeader()}
            />
          ) : (
            <ColHeaderLabel onClick={() => startEditHeader("B")}>{labelB}</ColHeaderLabel>
          )}
        </ColHeaderCell>
      </ColHeader>

      {/* ── Row list ─────────────────────────────────────── */}
      <RowList>
        {rows.map((row, i) => (
          <RowWrap
            key={row.id}
            faded={drag?.fromId === row.id}
            dropLineBefore={
              drag !== null && drag.fromId !== row.id && drag.dropIndex === i
            }
            ref={el => {
              if (el) rowEls.current.set(row.id, el);
              else rowEls.current.delete(row.id);
            }}
          >
            <RowGrid>
              <Handle
                onPointerDown={e => onHandleDown(e, row.id)}
                onPointerMove={onHandleMove}
                onPointerUp={onHandleUp}
              >
                ≡
              </Handle>

              {/* ── Cell A ─────────────────────────────── */}
              <KeyCell
                isDropTarget={
                  chipDrag !== null &&
                  chipDrag.targetRowId === row.id &&
                  chipDrag.targetSide === "A" &&
                  !(chipDrag.fromRowId === row.id && chipDrag.fromSide === "A")
                }
                ref={el => {
                  if (el) cellEls.current.set(`${row.id}-A`, el);
                  else cellEls.current.delete(`${row.id}-A`);
                }}
              >
                <ChipsArea>
                  {row.keywordA.map((kw, ki) => (
                    <Chip
                      key={ki}
                      style={{ opacity: chipDrag?.fromRowId === row.id && chipDrag.fromSide === "A" && chipDrag.fromIndex === ki ? 0.3 : 1 }}
                      onPointerDown={e => startChipDrag(e, row.id, "A", ki, kw)}
                      onPointerMove={handleChipMove}
                      onPointerUp={handleChipUp}
                    >
                      {kw}
                    </Chip>
                  ))}
                </ChipsArea>
                <CellEditBtn onClick={() => openCellEdit(row.id, "A")}>✎</CellEditBtn>
              </KeyCell>

              {/* ── Cell B ─────────────────────────────── */}
              <KeyCell
                borderLeft
                isDropTarget={
                  chipDrag !== null &&
                  chipDrag.targetRowId === row.id &&
                  chipDrag.targetSide === "B" &&
                  !(chipDrag.fromRowId === row.id && chipDrag.fromSide === "B")
                }
                ref={el => {
                  if (el) cellEls.current.set(`${row.id}-B`, el);
                  else cellEls.current.delete(`${row.id}-B`);
                }}
              >
                <ChipsArea>
                  {row.keywordB.map((kw, ki) => (
                    <Chip
                      key={ki}
                      style={{ opacity: chipDrag?.fromRowId === row.id && chipDrag.fromSide === "B" && chipDrag.fromIndex === ki ? 0.3 : 1 }}
                      onPointerDown={e => startChipDrag(e, row.id, "B", ki, kw)}
                      onPointerMove={handleChipMove}
                      onPointerUp={handleChipUp}
                    >
                      {kw}
                    </Chip>
                  ))}
                </ChipsArea>
                <CellEditBtn onClick={() => openCellEdit(row.id, "B")}>✎</CellEditBtn>
              </KeyCell>
            </RowGrid>
          </RowWrap>
        ))}

        {drag?.dropIndex === rows.length && <TrailingDropLine />}
      </RowList>

      {/* ── Chip drag ghost ───────────────────────────────── */}
      {chipDrag && (
        <GhostChip style={{ left: chipDrag.x, top: chipDrag.y }}>
          {chipDrag.keyword}
        </GhostChip>
      )}

      {/* ── FAB ──────────────────────────────────────────── */}
      <Fab onClick={addRow}>＋</Fab>

      {/* ── Cell edit bottom sheet ────────────────────────── */}
      {cellEdit && (
        <Overlay onClick={closeEdit}>
          <Sheet onClick={e => e.stopPropagation()}>
            <SheetTitle>
              {cellEdit.side === "A" ? labelA : labelB}を編集
            </SheetTitle>

            <DraftChipList>
              {cellEdit.draft.map((kw, i) => (
                <DraftChip key={i}>
                  {kw}
                  <RemoveChipBtn onClick={() => removeDraftKeyword(i)}>×</RemoveChipBtn>
                </DraftChip>
              ))}
            </DraftChipList>

            <AddKwRow
              onSubmit={e => {
                e.preventDefault();
                addDraftKeyword();
              }}
            >
              <Input
                autoFocus
                value={cellEdit.inputValue}
                onChange={e =>
                  setCellEdit(s => (s ? { ...s, inputValue: e.target.value } : s))
                }
                placeholder="キーワードを入力して追加…"
              />
              <AddKwBtn type="submit">追加</AddKwBtn>
            </AddKwRow>

            <Actions>
              <SaveBtn onClick={saveCellEdit}>保存</SaveBtn>
              <DeleteBtn onClick={deleteRow}>行を削除</DeleteBtn>
              <CancelBtn onClick={closeEdit}>キャンセル</CancelBtn>
            </Actions>
          </Sheet>
        </Overlay>
      )}
    </Root>
  );
};

export default IdeationScene;
