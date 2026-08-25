import styled from "@emotion/styled";
import { type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import { type CropCorner, type Rect, type Size } from "~/common/image-split";
import {
  alphaColor,
  em,
  percent,
  PRIMITIVE_COLOR,
  px
} from "~/common/css-util";
import MockActionButton from "~/component/MockActionButton";
import { MockCheckboxFormInput } from "~/component/mock-form-ui";

const SPLIT_COLUMNS = 3;
const HANDLE_SIZE = 16;

const pctNum = (value: number, total: number) => (value / total) * 100;

// left/top で寄せた辺は -50%、right/bottom で寄せた辺は +50% 側に
// translate しないと、ハンドルの中心が角の点からずれてしまう
const CORNER_STYLE: Record<
  CropCorner,
  { top?: 0; bottom?: 0; left?: 0; right?: 0; transform: string }
> = {
  nw: { top: 0, left: 0, transform: "translate(-50%, -50%)" },
  ne: { top: 0, right: 0, transform: "translate(50%, -50%)" },
  sw: { bottom: 0, left: 0, transform: "translate(-50%, 50%)" },
  se: { bottom: 0, right: 0, transform: "translate(50%, 50%)" }
};

const Stage = styled.div({
  position: "relative",
  lineHeight: 0,
  userSelect: "none",
  touchAction: "none",
  cursor: "crosshair"
});

const DimBand = styled.div({
  position: "absolute",
  background: alphaColor(PRIMITIVE_COLOR.BLACK, 0.5),
  pointerEvents: "none"
});

const GuideLine = styled.div({
  position: "absolute",
  top: 0,
  bottom: 0,
  width: px(2),
  transform: "translateX(-50%)",
  background: alphaColor(PRIMITIVE_COLOR.WHITE, 0.8),
  pointerEvents: "none"
});

// outline はボックスサイズに影響しないため、四隅のハンドルを
// border の分だけずらさずに正確に角へ重ねられる。
// ドラッグ操作は Stage 側でまとめて処理するため pointer-events は無効にする
const CropArea = styled.div({
  position: "absolute",
  boxSizing: "border-box",
  outline: `${px(2)} dashed ${PRIMITIVE_COLOR.WHITE}`,
  pointerEvents: "none"
});

// 見た目のサイズはこのまま小さく保ち、代わりに Stage 側で
// タップ位置から一番近い角を割り出して操作対象にする（当たり判定は
// 見た目に縛られない）ため、ハンドル自体は装飾のみで pointer-events を持たない
const CropHandle = styled.div<{ corner: CropCorner }>(({ corner }) => ({
  position: "absolute",
  ...CORNER_STYLE[corner],
  width: px(HANDLE_SIZE),
  height: px(HANDLE_SIZE),
  boxSizing: "border-box",
  background: PRIMITIVE_COLOR.WHITE,
  border: `${px(1)} solid ${PRIMITIVE_COLOR.BLACK}`
}));

const Toolbar = styled.div({
  display: "flex",
  gap: em(1)
});

const ImageTrimScene = ({
  imageUrl,
  naturalSize,
  cropRect,
  aspectLocked,
  isSplitting,
  imageRef,
  onFileChange,
  onStagePointerDown,
  onImageLoad,
  onResetCrop,
  onAspectLockedChange,
  onSplit
}: {
  imageUrl: string;
  naturalSize: Size | null;
  cropRect: Rect | null;
  aspectLocked: boolean;
  isSplitting: boolean;
  imageRef: RefObject<HTMLImageElement | null>;
  onFileChange: (files: File[]) => void;
  onStagePointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onImageLoad: (size: Size) => void;
  onResetCrop: () => void;
  onAspectLockedChange: (next: boolean) => void;
  onSplit: () => void;
}) => (
  <>
    <p>
      画像を選んで四隅付近をドラッグすると、一番近い角から切り抜き範囲を調整できます。「3分割する」を押すと縦に3等分した画像をそれぞれダウンロードできます。
    </p>
    <div>
      <MockActionButton action={{ type: "input-file", onChange: onFileChange }}>
        画像を選択
      </MockActionButton>
    </div>
    {imageUrl ? (
      <Stage onPointerDown={onStagePointerDown}>
        <img
          ref={imageRef}
          src={imageUrl}
          alt="編集対象の画像"
          style={{ display: "block", width: percent(100), height: "auto" }}
          onLoad={e => {
            const { naturalWidth, naturalHeight } = e.currentTarget;
            onImageLoad({ width: naturalWidth, height: naturalHeight });
          }}
        />
        {cropRect && naturalSize
          ? (() => {
              const left = pctNum(cropRect.x, naturalSize.width);
              const top = pctNum(cropRect.y, naturalSize.height);
              const width = pctNum(cropRect.width, naturalSize.width);
              const height = pctNum(cropRect.height, naturalSize.height);
              const right = left + width;
              const bottom = top + height;
              return (
                <>
                  <DimBand
                    style={{ left: 0, top: 0, width: percent(100), height: percent(top) }}
                  />
                  <DimBand
                    style={{
                      left: 0,
                      top: percent(bottom),
                      width: percent(100),
                      height: percent(100 - bottom)
                    }}
                  />
                  <DimBand
                    style={{
                      left: 0,
                      top: percent(top),
                      width: percent(left),
                      height: percent(height)
                    }}
                  />
                  <DimBand
                    style={{
                      left: percent(right),
                      top: percent(top),
                      width: percent(100 - right),
                      height: percent(height)
                    }}
                  />
                  <CropArea
                    style={{
                      left: percent(left),
                      top: percent(top),
                      width: percent(width),
                      height: percent(height)
                    }}
                  >
                    {Array.from({ length: SPLIT_COLUMNS - 1 }, (_, i) => (
                      <GuideLine
                        key={i}
                        style={{ left: percent(((i + 1) / SPLIT_COLUMNS) * 100) }}
                      />
                    ))}
                    {(["nw", "ne", "sw", "se"] as const).map(corner => (
                      <CropHandle key={corner} corner={corner} />
                    ))}
                  </CropArea>
                </>
              );
            })()
          : null}
      </Stage>
    ) : null}
    {imageUrl ? (
      <MockCheckboxFormInput value={aspectLocked} onChange={onAspectLockedChange}>
        元画像の縦横比を固定する
      </MockCheckboxFormInput>
    ) : null}
    {imageUrl ? (
      <Toolbar>
        <MockActionButton
          action={naturalSize ? { type: "button", onClick: onResetCrop } : null}
        >
          切り抜きをリセット
        </MockActionButton>
        <MockActionButton
          action={
            cropRect && !isSplitting ? { type: "button", onClick: onSplit } : null
          }
        >
          {isSplitting ? "分割中…" : "3分割する"}
        </MockActionButton>
      </Toolbar>
    ) : null}
  </>
);

export default ImageTrimScene;
