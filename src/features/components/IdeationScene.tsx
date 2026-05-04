"use client";

import styled from "@emotion/styled";
import { useState, useRef, useCallback } from "react";
import { buttonReset, px } from "~/common/lib/css-util";

type RowType = "抽象" | "具体";

type Row = {
  id: number;
  type: RowType;
  keywordA: string;
  keywordB: string;
};

type DragState = {
  fromId: number;
  dropIndex: number;
};

type FormState = {
  id: number | null; // null = new row
  type: RowType;
  keywordA: string;
  keywordB: string;
};

const INITIAL_ROWS: Row[] = [
  { id: 1, type: "抽象", keywordA: "自由", keywordB: "秩序" },
  { id: 2, type: "具体", keywordA: "遊び", keywordB: "仕事" },
  { id: 3, type: "抽象", keywordA: "夢", keywordB: "現実" }
];

// 4-column grid shared between header and rows
const GRID_COLS = "40px 1fr 1fr 48px";

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

const ColHeaderLabel = styled.div<{ borderLeft?: boolean }>(
  ({ borderLeft }) => ({
    padding: px(13, 16),
    fontSize: px(11),
    fontWeight: 800,
    letterSpacing: "0.12em",
    color: "rgba(0,0,0,0.38)",
    borderLeft: borderLeft ? "1px solid rgba(0,0,0,0.1)" : "none"
  })
);

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
  minHeight: px(54),
  cursor: "pointer",
  "&:active": { background: "#f5f4f0" }
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

const KeyCell = styled.div<{ borderLeft?: boolean }>(({ borderLeft }) => ({
  display: "flex",
  alignItems: "center",
  gap: px(8),
  padding: px(12, 14),
  fontSize: px(15),
  fontWeight: 600,
  color: "#222",
  borderLeft: borderLeft ? "1px solid rgba(0,0,0,0.1)" : "none",
  minWidth: 0
}));

const Badge = styled.span<{ kind: RowType }>(({ kind }) => ({
  flexShrink: 0,
  fontSize: px(10),
  fontWeight: 700,
  padding: px(2, 6),
  borderRadius: px(4),
  background:
    kind === "抽象"
      ? "rgba(100,140,255,0.14)"
      : "rgba(60,200,150,0.14)",
  color: kind === "抽象" ? "#3355cc" : "#1a8860"
}));

const KeyText = styled.span({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
});

const EditIconBtn = styled.button(buttonReset, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgba(0,0,0,0.22)",
  fontSize: px(17),
  width: "100%",
  height: "100%",
  "&:hover": { color: "#222" }
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

// Bottom sheet modal
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

const Field = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: px(6)
});

const FieldLabel = styled.label({
  fontSize: px(11),
  fontWeight: 700,
  letterSpacing: "0.1em",
  color: "rgba(0,0,0,0.38)",
  textTransform: "uppercase"
});

const TypeRow = styled.div({
  display: "flex",
  gap: px(8)
});

const TypeBtn = styled.button<{ active: boolean }>(
  buttonReset,
  ({ active }) => ({
    flex: 1,
    padding: px(10, 0),
    borderRadius: px(8),
    border: "1.5px solid",
    borderColor: active ? "#222" : "rgba(0,0,0,0.18)",
    background: active ? "#222" : "transparent",
    color: active ? "#fff" : "rgba(0,0,0,0.42)",
    fontSize: px(14),
    fontWeight: 700,
    cursor: "pointer"
  })
);

const Input = styled.input({
  border: "1.5px solid #ddd",
  borderRadius: px(8),
  padding: px(11, 12),
  fontSize: px(16),
  fontFamily: "inherit",
  outline: "none",
  "&:focus": { borderColor: "#222" },
  "&::placeholder": { color: "#ccc" }
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
  "&:disabled": { opacity: 0.35, pointerEvents: "none" }
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
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const rowEls = useRef<Map<number, HTMLDivElement>>(new Map());

  // Compute insertion index from pointer Y position
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

  // ── Drag-to-reorder (pointer capture on handle) ───────────
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

  // ── Form (add / edit) ─────────────────────────────────────
  const openAdd = useCallback(
    () => setForm({ id: null, type: "抽象", keywordA: "", keywordB: "" }),
    []
  );

  const openEdit = useCallback(
    (row: Row) =>
      setForm({
        id: row.id,
        type: row.type,
        keywordA: row.keywordA,
        keywordB: row.keywordB
      }),
    []
  );

  const closeForm = useCallback(() => setForm(null), []);

  const saveForm = useCallback(() => {
    if (!form) return;
    const a = form.keywordA.trim();
    const b = form.keywordB.trim();
    if (!a && !b) return;
    if (form.id === null) {
      setRows(prev => [
        ...prev,
        { id: Date.now(), type: form.type, keywordA: a, keywordB: b }
      ]);
    } else {
      setRows(prev =>
        prev.map(r =>
          r.id === form.id
            ? { ...r, type: form.type, keywordA: a, keywordB: b }
            : r
        )
      );
    }
    setForm(null);
  }, [form]);

  const deleteRow = useCallback(() => {
    if (!form || form.id === null) return;
    setRows(prev => prev.filter(r => r.id !== form.id));
    setForm(null);
  }, [form]);

  return (
    <Root>
      {/* ── Column headers ───────────────────────────────── */}
      <ColHeader>
        <div />
        <ColHeaderLabel>グループ A</ColHeaderLabel>
        <ColHeaderLabel borderLeft>グループ B</ColHeaderLabel>
        <div />
      </ColHeader>

      {/* ── Row list ─────────────────────────────────────── */}
      <RowList>
        {rows.map((row, i) => (
          <RowWrap
            key={row.id}
            faded={drag?.fromId === row.id}
            dropLineBefore={
              drag !== null &&
              drag.fromId !== row.id &&
              drag.dropIndex === i
            }
            ref={el => {
              if (el) rowEls.current.set(row.id, el);
              else rowEls.current.delete(row.id);
            }}
          >
            <RowGrid onClick={() => !drag && openEdit(row)}>
              <Handle
                onPointerDown={e => onHandleDown(e, row.id)}
                onPointerMove={onHandleMove}
                onPointerUp={onHandleUp}
                onClick={e => e.stopPropagation()}
              >
                ≡
              </Handle>
              <KeyCell>
                <Badge kind={row.type}>{row.type}</Badge>
                <KeyText>{row.keywordA}</KeyText>
              </KeyCell>
              <KeyCell borderLeft>
                <KeyText>{row.keywordB}</KeyText>
              </KeyCell>
              <EditIconBtn
                onClick={e => {
                  e.stopPropagation();
                  openEdit(row);
                }}
              >
                ✎
              </EditIconBtn>
            </RowGrid>
          </RowWrap>
        ))}

        {/* Drop line after last row */}
        {drag?.dropIndex === rows.length && <TrailingDropLine />}
      </RowList>

      {/* ── FAB ──────────────────────────────────────────── */}
      <Fab onClick={openAdd}>＋</Fab>

      {/* ── Add / Edit bottom sheet ───────────────────────── */}
      {form && (
        <Overlay onClick={closeForm}>
          <Sheet onClick={e => e.stopPropagation()}>
            <SheetTitle>
              {form.id === null ? "行を追加" : "行を編集"}
            </SheetTitle>

            <Field>
              <FieldLabel>種類</FieldLabel>
              <TypeRow>
                {(["抽象", "具体"] as RowType[]).map(t => (
                  <TypeBtn
                    key={t}
                    active={form.type === t}
                    onClick={() =>
                      setForm(f => (f ? { ...f, type: t } : f))
                    }
                  >
                    {t}
                  </TypeBtn>
                ))}
              </TypeRow>
            </Field>

            <Field>
              <FieldLabel>グループ A</FieldLabel>
              <Input
                autoFocus
                value={form.keywordA}
                onChange={e =>
                  setForm(f => (f ? { ...f, keywordA: e.target.value } : f))
                }
                onKeyDown={e => e.key === "Enter" && saveForm()}
                placeholder="キーワードを入力…"
              />
            </Field>

            <Field>
              <FieldLabel>グループ B</FieldLabel>
              <Input
                value={form.keywordB}
                onChange={e =>
                  setForm(f => (f ? { ...f, keywordB: e.target.value } : f))
                }
                onKeyDown={e => e.key === "Enter" && saveForm()}
                placeholder="キーワードを入力…"
              />
            </Field>

            <Actions>
              <SaveBtn
                disabled={!form.keywordA.trim() && !form.keywordB.trim()}
                onClick={saveForm}
              >
                保存
              </SaveBtn>
              {form.id !== null && (
                <DeleteBtn onClick={deleteRow}>削除</DeleteBtn>
              )}
              <CancelBtn onClick={closeForm}>キャンセル</CancelBtn>
            </Actions>
          </Sheet>
        </Overlay>
      )}
    </Root>
  );
};

export default IdeationScene;
