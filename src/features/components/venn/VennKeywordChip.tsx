"use client";

import styled from "@emotion/styled";
import { useRef, useCallback } from "react";
import { responsiveUnit } from "~/features/lib/emotion-mixin";

type Props = {
  id: string;
  text: string;
  onDragStart: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
};

const Chip = styled.div(
  {
    display: "inline-flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.85)",
    border: "0 solid rgba(80,80,120,0.25)",
    fontWeight: 600,
    color: "#333",
    cursor: "grab",
    userSelect: "none",
    touchAction: "none",
    transition: "box-shadow 0.15s",
    "&:active": {
      cursor: "grabbing"
    }
  },
  responsiveUnit(u => ({
    gap: u(4),
    padding: u(4, 10),
    borderRadius: u(20),
    fontSize: u(13),
    borderWidth: u(1.5),
    boxShadow: `${u(0, 1, 4)} rgba(0,0,0,0.1)`,
    "&:active": {
      boxShadow: `${u(0, 4, 16)} rgba(0,0,0,0.2)`
    }
  }))
);

const DeleteBtn = styled.button(
  {
    appearance: "none",
    border: "none",
    background: "none",
    padding: 0,
    margin: 0,
    lineHeight: 1,
    cursor: "pointer",
    color: "#aaa",
    display: "flex",
    alignItems: "center"
  },
  responsiveUnit(u => ({
    fontSize: u(14)
  }))
);

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
