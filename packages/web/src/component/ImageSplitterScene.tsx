import styled from "@emotion/styled";
import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState
} from "react";
import {
  type CropCorner,
  type Rect,
  type Size,
  fitRectToAspect,
  nearestCorner,
  resizeRectFromCorner,
  resizeRectFromCornerLocked,
  splitRectIntoColumns
} from "~/common/image-split";
import { em, px } from "~/common/css-util";
import ImageSplitResultScene from "~/component/ImageSplitResultScene";
import ImageTrimScene from "~/component/ImageTrimScene";

const SPLIT_COLUMNS = 3;

// toDataURL は PNG バイト列を base64 文字列化して React state / DOM に
// そのまま保持することになり、写真サイズだと数MB〜のメモリを圧迫する。
// toBlob + object URL ならバイナリのまま保持でき、参照する URL 文字列も短い
const canvasToObjectUrl = (canvas: HTMLCanvasElement): Promise<string> =>
  new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(blob ? URL.createObjectURL(blob) : "");
    }, "image/png");
  });

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

const ImageSplitterScene = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [naturalSize, setNaturalSize] = useState<Size | null>(null);
  const [cropRect, setCropRect] = useState<Rect | null>(null);
  const [columnImages, setColumnImages] = useState<string[] | null>(null);
  const [activeCorner, setActiveCorner] = useState<CropCorner | null>(null);
  const [aspectLocked, setAspectLocked] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);

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

  useEffect(
    () => () => {
      columnImages?.forEach(url => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    },
    [columnImages]
  );

  useEffect(() => {
    if (!activeCorner || !naturalSize) {
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
        return aspectLocked
          ? resizeRectFromCornerLocked(
              rect,
              activeCorner,
              dx,
              dy,
              naturalSize,
              naturalSize.width / naturalSize.height
            )
          : resizeRectFromCorner(rect, activeCorner, dx, dy, naturalSize);
      });
    };
    const handlePointerUp = () => {
      lastPointerRef.current = null;
      setActiveCorner(null);
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [activeCorner, aspectLocked, naturalSize]);

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

  const handleImageLoad = (size: Size) => {
    setNaturalSize(size);
    setCropRect({ x: 0, y: 0, ...size });
    setColumnImages(null);
  };

  const handleStagePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const img = imgRef.current;
    if (!img || !cropRect || !naturalSize) {
      return;
    }
    const imgRect = img.getBoundingClientRect();
    const scale = naturalSize.width / imgRect.width;
    const point = {
      x: (e.clientX - imgRect.left) * scale,
      y: (e.clientY - imgRect.top) * scale
    };
    e.preventDefault();
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    setActiveCorner(nearestCorner(cropRect, point));
  };

  const handleResetCrop = () => {
    if (!naturalSize) {
      return;
    }
    setCropRect({ x: 0, y: 0, ...naturalSize });
    setColumnImages(null);
  };

  const handleAspectLockedChange = (next: boolean) => {
    setAspectLocked(next);
    if (next && naturalSize) {
      setCropRect(rect =>
        rect
          ? fitRectToAspect(
              rect,
              naturalSize.width / naturalSize.height,
              naturalSize
            )
          : rect
      );
      setColumnImages(null);
    }
  };

  const handleSplit = async () => {
    const img = imgRef.current;
    if (!img || !cropRect || isSplitting) {
      return;
    }
    setIsSplitting(true);
    try {
      const urls = await Promise.all(
        splitRectIntoColumns(cropRect, SPLIT_COLUMNS).map(col => {
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
          return canvasToObjectUrl(canvas);
        })
      );
      setColumnImages(urls);
    } finally {
      setIsSplitting(false);
    }
  };

  const handleBack = () => {
    setColumnImages(null);
  };

  return (
    <Wrapper>
      <TitleLine>画像3分割ツール</TitleLine>
      {columnImages ? (
        <ImageSplitResultScene columnImages={columnImages} onBack={handleBack} />
      ) : (
        <ImageTrimScene
          imageUrl={imageUrl}
          naturalSize={naturalSize}
          cropRect={cropRect}
          aspectLocked={aspectLocked}
          isSplitting={isSplitting}
          imageRef={imgRef}
          onFileChange={handleFileChange}
          onStagePointerDown={handleStagePointerDown}
          onImageLoad={handleImageLoad}
          onResetCrop={handleResetCrop}
          onAspectLockedChange={handleAspectLockedChange}
          onSplit={handleSplit}
        />
      )}
    </Wrapper>
  );
};

export default ImageSplitterScene;
