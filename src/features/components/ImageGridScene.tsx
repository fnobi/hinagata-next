"use client";

import { useState, useCallback, useRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

const COLS = 6;
const ROWS = 2;
const TOTAL = COLS * ROWS;

const CELL_DRAG_TYPE = "application/x-cell-index";

interface CellProps {
  index: number;
  src: string | null;
  isBeingDragged: boolean;
  onFileDrop: (index: number, file: File) => void;
  onCellDragStart: (index: number) => void;
  onCellSwap: (fromIndex: number, toIndex: number) => void;
  onDragEnd: () => void;
}

const GridCell = ({
  index,
  src,
  isBeingDragged,
  onFileDrop,
  onCellDragStart,
  onCellSwap,
  onDragEnd
}: CellProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      if (!src) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData(CELL_DRAG_TYPE, String(index));
      e.dataTransfer.effectAllowed = "move";
      onCellDragStart(index);
    },
    [src, index, onCellDragStart]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const cellIndexStr = e.dataTransfer.getData(CELL_DRAG_TYPE);
      if (cellIndexStr !== "") {
        onCellSwap(parseInt(cellIndexStr, 10), index);
      } else {
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
          onFileDrop(index, file);
        }
      }
    },
    [index, onFileDrop, onCellSwap]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileDrop(index, file);
      e.target.value = "";
    },
    [index, onFileDrop]
  );

  return (
    <CellRoot
      draggable={!!src}
      isDragOver={isDragOver}
      hasSrc={!!src}
      isBeingDragged={isBeingDragged}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {src ? (
        <CellImage src={src} alt={`cell-${index + 1}`} />
      ) : (
        <CellPlaceholder>{index + 1}</CellPlaceholder>
      )}
      <HiddenInput
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
    </CellRoot>
  );
};

const ImageGridScene = () => {
  const [images, setImages] = useState<(string | null)[]>(
    Array(TOTAL).fill(null)
  );
  const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null);

  const handleFileDrop = useCallback((index: number, file: File) => {
    const url = URL.createObjectURL(file);
    setImages(prev => {
      const next = [...prev];
      const old = next[index];
      if (old) URL.revokeObjectURL(old);
      next[index] = url;
      return next;
    });
  }, []);

  const handleCellDragStart = useCallback((index: number) => {
    setDragSourceIndex(index);
  }, []);

  const handleCellSwap = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setImages(prev => {
      const next = [...prev];
      [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
      return next;
    });
    setDragSourceIndex(null);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragSourceIndex(null);
  }, []);

  const handleClear = useCallback(() => {
    setImages(prev => {
      prev.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
      return Array(TOTAL).fill(null);
    });
  }, []);

  return (
    <Root>
      <GridWrapper>
        <Grid>
          {images.map((src, i) => (
            <GridCell
              key={i}
              index={i}
              src={src}
              isBeingDragged={dragSourceIndex === i}
              onFileDrop={handleFileDrop}
              onCellDragStart={handleCellDragStart}
              onCellSwap={handleCellSwap}
              onDragEnd={handleDragEnd}
            />
          ))}
        </Grid>
      </GridWrapper>
      <Controls>
        <ClearButton onClick={handleClear}>クリア</ClearButton>
        <Note>
          各セルに画像をD&Dまたはクリックして配置 / セル間でD&Dして入れ替え
        </Note>
      </Controls>
    </Root>
  );
};

export default ImageGridScene;

// ---- styles ----

const Root = styled.div({
  minHeight: "100dvh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px 16px",
  backgroundColor: "#1a1a1a",
  gap: 20,
  boxSizing: "border-box"
});

const GridWrapper = styled.div({
  width: "100%",
  maxWidth: "min(90vw, calc(90vh * 3 / 2))",
  aspectRatio: "3 / 2",
  backgroundColor: "#000"
});

const Grid = styled.div({
  width: "100%",
  height: "100%",
  display: "grid",
  gridTemplateColumns: `repeat(${COLS}, 1fr)`,
  gridTemplateRows: `repeat(${ROWS}, 1fr)`,
  gap: 2
});

const CellRoot = styled.div<{
  isDragOver: boolean;
  hasSrc: boolean;
  isBeingDragged: boolean;
}>(
  {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#2a2a2a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.15s, opacity 0.15s"
  },
  ({ isDragOver, hasSrc, isBeingDragged }) =>
    css({
      cursor: hasSrc ? "grab" : "pointer",
      backgroundColor: isDragOver ? "#3a5f8a" : hasSrc ? "#000" : "#2a2a2a",
      outline: isDragOver ? "2px solid #5a9fd4" : "none",
      outlineOffset: -2,
      opacity: isBeingDragged ? 0.35 : 1
    })
);

const CellImage = styled.img({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  pointerEvents: "none"
});

const CellPlaceholder = styled.span({
  color: "#444",
  fontSize: 11,
  userSelect: "none",
  pointerEvents: "none"
});

const HiddenInput = styled.input({
  display: "none"
});

const Controls = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 16
});

const ClearButton = styled.button({
  padding: "8px 20px",
  backgroundColor: "#333",
  color: "#ccc",
  border: "1px solid #555",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 14,
  "&:hover": {
    backgroundColor: "#444"
  }
});

const Note = styled.p({
  color: "#666",
  fontSize: 12
});
