"use client";

import styled from "@emotion/styled";
import { useRef, useCallback } from "react";

type Props = {
  id: string;
  text: string;
  onDragStart: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
};

const Chip = styled.div({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "4px 10px",
  borderRadius: 20,
  background: "rgba(255,255,255,0.85)",
  border: "1.5px solid rgba(80,80,120,0.25)",
  fontSize: 13,
  fontWeight: 600,
  color: "#333",
  cursor: "grab",
  userSelect: "none",
  touchAction: "none",
  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  transition: "box-shadow 0.15s",
  "&:active": {
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    cursor: "grabbing"
  }
});

const DeleteBtn = styled.button({
  appearance: "none",
  border: "none",
  background: "none",
  padding: 0,
  margin: 0,
  lineHeight: 1,
  cursor: "pointer",
  color: "#aaa",
  fontSize: 14,
  display: "flex",
  alignItems: "center"
});

const VennKeywordChip = ({
  id,
  text,
  onDragStart,
  onDragEnd,
  onDelete
}: Props) => {
  const touchRef = useRef<{ startX: number; startY: number } | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const t = e.touches[0];
      touchRef.current = { startX: t.clientX, startY: t.clientY };
      onDragStart(id);
    },
    [id, onDragStart]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const t = e.changedTouches[0];
      onDragEnd(id, t.clientX, t.clientY);
      touchRef.current = null;
    },
    [id, onDragEnd]
  );

  const handleMouseDown = useCallback(() => {
    onDragStart(id);
  }, [id, onDragStart]);

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      onDragEnd(id, e.clientX, e.clientY);
    },
    [id, onDragEnd]
  );

  return (
    <Chip
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {text}
      <DeleteBtn
        onClick={e => {
          e.stopPropagation();
          onDelete(id);
        }}
        aria-label="削除"
      >
        ×
      </DeleteBtn>
    </Chip>
  );
};

export default VennKeywordChip;
