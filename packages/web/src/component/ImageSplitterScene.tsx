import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import {
  type CropCorner,
  type Rect,
  type Size,
  moveRect,
  resizeRectFromCorner,
  splitRectIntoColumns
} from "~/common/image-split";
import {
  alphaColor,
  em,
  percent,
  PRIMITIVE_COLOR,
  px
} from "~/common/css-util";
import MockActionButton from "~/component/MockActionButton";

const SPLIT_COLUMNS = 3;
const HANDLE_SIZE = 16;

type DragMode = { type: "move" } | { type: "resize"; corner: CropCorner };

const CORNER_STYLE: Record<
  CropCorner,
  { top?: 0; bottom?: 0; left?: 0; right?: 0; cursor: string }
> = {
  nw: { top: 0, left: 0, cursor: "nwse-resize" },
  ne: { top: 0, right: 0, cursor: "nesw-resize" },
  sw: { bottom: 0, left: 0, cursor: "nesw-resize" },
  se: { bottom: 0, right: 0, cursor: "nwse-resize" }
};

const Wrapper = styled.div({
  margin: "auto",
  maxWidth: px(720),
  padding: em(1),
  display: "flex",
  flexDirection: "column",
  gap: em(1)
});

const TitleLine = styled.div({
  fontWeight: "bold",
  fontSize: em(1.2)
});

const Stage = styled.div({
  position: "relative",
  lineHeight: 0,
  userSelect: "none",
  touchAction: "none"
});

const CropOverlay = styled.div({
  position: "absolute",
  boxSizing: "border-box",
  border: `${px(2)} dashed ${PRIMITIVE_COLOR.WHITE}`,
  boxShadow: `0 0 0 ${px(9999)} ${alphaColor(PRIMITIVE_COLOR.BLACK, 0.5)}`,
  cursor: "move"
});

const CropHandle = styled.div<{ corner: CropCorner }>(({ corner }) => ({
  position: "absolute",
  ...CORNER_STYLE[corner],
  width: px(HANDLE_SIZE),
  height: px(HANDLE_SIZE),
  boxSizing: "border-box",
  transform: "translate(-50%, -50%)",
  background: PRIMITIVE_COLOR.WHITE,
  border: `${px(1)} solid ${PRIMITIVE_COLOR.BLACK}`,
  cursor: CORNER_STYLE[corner].cursor
}));

const Toolbar = styled.div({
  display: "flex",
  gap: em(1)
});

const ResultGrid = styled.div({
  display: "flex",
  gap: px(4)
});

const ResultCell = styled.div({
  flex: "1 1 0",
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: em(0.5)
});

const ImageSplitterScene = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [naturalSize, setNaturalSize] = useState<Size | null>(null);
  const [cropRect, setCropRect] = useState<Rect | null>(null);
  const [columnImages, setColumnImages] = useState<string[] | null>(null);
  const [dragMode, setDragMode] = useState<DragMode | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(
    () => () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    },
    [imageUrl]
  );

  useEffect(() => {
    if (!dragMode || !naturalSize) {
      return undefined;
    }
    const handlePointerMove = (e: PointerEvent) => {
      const last = lastPointerRef.current;
      const img = imgRef.current;
      if (!last || !img || !img.clientWidth) {
        return;
      }
      const scale = naturalSize.width / img.clientWidth;
      const dx = (e.clientX - last.x) * scale;
      const dy = (e.clientY - last.y) * scale;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      setCropRect(rect => {
        if (!rect) {
          return rect;
        }
        return dragMode.type === "move"
          ? moveRect(rect, dx, dy, naturalSize)
          : resizeRectFromCorner(rect, dragMode.corner, dx, dy, naturalSize);
      });
    };
    const handlePointerUp = () => {
      lastPointerRef.current = null;
      setDragMode(null);
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragMode, naturalSize]);

  const handleFileChange = (files: File[]) => {
    const nextFile = files[0];
    if (!nextFile) {
      return;
    }
    setNaturalSize(null);
    setCropRect(null);
    setColumnImages(null);
    setImageUrl(URL.createObjectURL(nextFile));
  };

  const handleResetCrop = () => {
    if (!naturalSize) {
      return;
    }
    setCropRect({ x: 0, y: 0, ...naturalSize });
    setColumnImages(null);
  };

  const handleSplit = () => {
    const img = imgRef.current;
    if (!img || !cropRect) {
      return;
    }
    const urls = splitRectIntoColumns(cropRect, SPLIT_COLUMNS).map(col => {
      const canvas = document.createElement("canvas");
      canvas.width = col.width;
      canvas.height = col.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return "";
      }
      ctx.drawImage(
        img,
        col.x,
        col.y,
        col.width,
        col.height,
        0,
        0,
        col.width,
        col.height
      );
      return canvas.toDataURL("image/png");
    });
    setColumnImages(urls);
  };

  return (
    <Wrapper>
      <TitleLine>画像3分割ツール</TitleLine>
      <p>
        画像を選んで切り抜き範囲をドラッグで調整し、「3分割する」を押すと縦に3等分した画像をそれぞれダウンロードできます。
      </p>
      <div>
        <MockActionButton
          action={{ type: "input-file", onChange: handleFileChange }}
        >
          画像を選択
        </MockActionButton>
      </div>
      {imageUrl ? (
        <Stage>
          <img
            ref={imgRef}
            src={imageUrl}
            alt="編集対象の画像"
            style={{ display: "block", width: percent(100), height: "auto" }}
            onLoad={e => {
              const { naturalWidth, naturalHeight } = e.currentTarget;
              const size = { width: naturalWidth, height: naturalHeight };
              setNaturalSize(size);
              setCropRect({ x: 0, y: 0, ...size });
              setColumnImages(null);
            }}
          />
          {cropRect && naturalSize ? (
            <CropOverlay
              style={{
                left: percent((cropRect.x / naturalSize.width) * 100),
                top: percent((cropRect.y / naturalSize.height) * 100),
                width: percent((cropRect.width / naturalSize.width) * 100),
                height: percent((cropRect.height / naturalSize.height) * 100)
              }}
              onPointerDown={e => {
                e.preventDefault();
                lastPointerRef.current = { x: e.clientX, y: e.clientY };
                setDragMode({ type: "move" });
              }}
            >
              {(["nw", "ne", "sw", "se"] as const).map(corner => (
                <CropHandle
                  key={corner}
                  corner={corner}
                  onPointerDown={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    lastPointerRef.current = { x: e.clientX, y: e.clientY };
                    setDragMode({ type: "resize", corner });
                  }}
                />
              ))}
            </CropOverlay>
          ) : null}
        </Stage>
      ) : null}
      {imageUrl ? (
        <Toolbar>
          <MockActionButton
            action={naturalSize ? { type: "button", onClick: handleResetCrop } : null}
          >
            切り抜きをリセット
          </MockActionButton>
          <MockActionButton
            action={cropRect ? { type: "button", onClick: handleSplit } : null}
          >
            3分割する
          </MockActionButton>
        </Toolbar>
      ) : null}
      {columnImages ? (
        <ResultGrid>
          {columnImages.map((url, i) => (
            <ResultCell key={i}>
              <img
                src={url}
                alt={`分割画像 ${i + 1}`}
                style={{ display: "block", width: percent(100) }}
              />
              <MockActionButton
                action={{
                  type: "download",
                  href: url,
                  download: `split-${i + 1}.png`
                }}
              >
                画像{i + 1}を保存
              </MockActionButton>
            </ResultCell>
          ))}
        </ResultGrid>
      ) : null}
    </Wrapper>
  );
};

export default ImageSplitterScene;
