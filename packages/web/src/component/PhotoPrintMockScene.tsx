import styled from "@emotion/styled";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import { em, percent, px } from "~/common/css-util";
import PhotoPrintStage from "~/feature/PhotoPrintStage";
import MockActionButton from "~/component/MockActionButton";
import MockStaticLayout from "~/component/MockStaticLayout";

const MIN_SELECTION_PX = 12;

const Toolbar = styled.div({
  display: "flex",
  gap: em(1),
  alignItems: "center"
});

const Stage = styled.div({
  position: "relative",
  width: percent(100),
  backgroundColor: "#ddd",
  touchAction: "none",
  cursor: "crosshair",
  userSelect: "none"
});

const Controls = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: em(0.5)
});

const ControlRow = styled.label({
  display: "flex",
  alignItems: "center",
  gap: em(1)
});

const ControlLabel = styled.span({
  width: em(8)
});

const CHECKER_BG =
  "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 20px 20px";

const SelectionBox = styled.div({
  position: "absolute",
  border: `${px(1)} dashed #fff`,
  outline: `${px(1)} dashed #000`,
  pointerEvents: "none"
});

type Point = { x: number; y: number };

const toBox = (a: Point, b: Point) => ({
  left: Math.min(a.x, b.x),
  top: Math.min(a.y, b.y),
  width: Math.abs(a.x - b.x),
  height: Math.abs(a.y - b.y)
});

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("画像を読み込めませんでした"));
    };
    img.src = url;
  });

const PhotoPrintMockScene = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const stage = useRef<PhotoPrintStage | null>(null);
  const [aspect, setAspect] = useState<number | null>(null);
  const [printCount, setPrintCount] = useState(0);
  const [fade, setFade] = useState(0.5);
  const [borderRatio, setBorderRatio] = useState(0.06);
  const [showBackground, setShowBackground] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ start: Point; current: Point } | null>(
    null
  );

  useEffect(() => {
    const el = stageRef.current;
    if (!el || aspect === null) {
      return undefined;
    }
    // 画像が差し替わるたびにステージを作り直さず、初回のみ生成する
    if (!stage.current) {
      stage.current = new PhotoPrintStage(el);
    }
    return undefined;
  }, [aspect]);

  useEffect(
    () => () => {
      stage.current?.dispose();
      stage.current = null;
    },
    []
  );

  useEffect(() => {
    stage.current?.setParams({ fade, borderRatio });
  }, [fade, borderRatio, aspect]);

  useEffect(() => {
    stage.current?.setBackgroundVisible(showBackground);
  }, [showBackground, aspect]);

  const onDownload = async () => {
    const blob = await stage.current?.toBlob();
    if (!blob) {
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "photo-print.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onFiles = async (files: File[]) => {
    const [file] = files;
    if (!file) {
      return;
    }
    try {
      setError(null);
      const img = await loadImage(file);
      setAspect(img.naturalWidth / img.naturalHeight);
      // ステージ生成(上の effect)が済んでから画像を渡す
      requestAnimationFrame(() => {
        stage.current?.setImage(img);
        setPrintCount(0);
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const toLocal = (e: PointerEvent): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(Math.max(e.clientX - rect.left, 0), rect.width),
      y: Math.min(Math.max(e.clientY - rect.top, 0), rect.height)
    };
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = toLocal(e);
    setDrag({ start: p, current: p });
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag) {
      return;
    }
    setDrag({ ...drag, current: toLocal(e) });
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag || !stage.current?.size) {
      setDrag(null);
      return;
    }
    const box = toBox(drag.start, toLocal(e));
    setDrag(null);
    if (box.width < MIN_SELECTION_PX || box.height < MIN_SELECTION_PX) {
      return;
    }
    const { width, height } = stage.current.size;
    const view = e.currentTarget.getBoundingClientRect();
    const sx = width / view.width;
    const sy = height / view.height;
    stage.current.addPrint({
      x: box.left * sx,
      y: box.top * sy,
      w: box.width * sx,
      h: box.height * sy
    });
    setPrintCount(stage.current.printCount);
  };

  return (
    <MockStaticLayout title="写真プリントサンプル">
      <Toolbar>
        <MockActionButton action={{ type: "input-file", onChange: onFiles }}>
          写真をアップロード
        </MockActionButton>
        <MockActionButton
          action={
            printCount > 0
              ? {
                  type: "button",
                  onClick: () => {
                    stage.current?.undo();
                    setPrintCount(stage.current?.printCount ?? 0);
                  }
                }
              : null
          }
        >
          1つ戻す
        </MockActionButton>
        <MockActionButton
          action={
            printCount > 0
              ? {
                  type: "button",
                  onClick: () => {
                    stage.current?.clear();
                    setPrintCount(0);
                  }
                }
              : null
          }
        >
          全部消す
        </MockActionButton>
        <MockActionButton
          action={
            aspect !== null ? { type: "button", onClick: onDownload } : null
          }
        >
          ダウンロード
        </MockActionButton>
      </Toolbar>
      {error ? <div>{error}</div> : null}
      {aspect === null ? (
        <p>
          写真をアップロードして、プレビュー上をドラッグで範囲選択してください。
        </p>
      ) : (
        <Stage
          ref={stageRef}
          style={{
            aspectRatio: aspect,
            background: showBackground ? undefined : CHECKER_BG
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => setDrag(null)}
        >
          {drag ? (
            <SelectionBox style={toBox(drag.start, drag.current)} />
          ) : null}
        </Stage>
      )}
      <Controls>
        <ControlRow>
          <ControlLabel>色褪せ具合</ControlLabel>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={fade}
            onChange={e => setFade(Number(e.target.value))}
          />
        </ControlRow>
        <ControlRow>
          <ControlLabel>白枠の幅</ControlLabel>
          <input
            type="range"
            min={0}
            max={0.15}
            step={0.005}
            value={borderRatio}
            onChange={e => setBorderRatio(Number(e.target.value))}
          />
        </ControlRow>
        <ControlRow>
          <ControlLabel>下絵を表示</ControlLabel>
          <input
            type="checkbox"
            checked={showBackground}
            onChange={e => setShowBackground(e.target.checked)}
          />
        </ControlRow>
      </Controls>
    </MockStaticLayout>
  );
};

export default PhotoPrintMockScene;
