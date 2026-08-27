import styled from "@emotion/styled";
import { useMemo } from "react";
import { em, percent, px } from "~/common/css-util";
import MockActionButton from "~/component/MockActionButton";

export type SplitImage = { url: string; blob: Blob };

export const OUTPUT_MIME_TYPE = "image/jpeg";
export const OUTPUT_EXTENSION = "jpg";
export const OUTPUT_QUALITY = 0.92;

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

const ShareRow = styled.div({
  display: "flex",
  justifyContent: "center"
});

const BackRow = styled.div({
  display: "flex",
  justifyContent: "center"
});

const buildFileName = (index: number, timestamp: string) =>
  [`split-${index + 1}`, timestamp].filter(Boolean).join("-") +
  `.${OUTPUT_EXTENSION}`;

const ImageSplitResultScene = ({
  columnImages,
  timestamp,
  onBack
}: {
  columnImages: SplitImage[];
  timestamp: string;
  onBack: () => void;
}) => {
  const shareFiles = useMemo(
    () =>
      columnImages.map(
        (image, i) =>
          new File([image.blob], buildFileName(i, timestamp), {
            type: OUTPUT_MIME_TYPE
          })
      ),
    [columnImages, timestamp]
  );

  // Web Share API (files) は未対応ブラウザも多いため、対応している場合のみ
  // 「まとめて共有」を出し、非対応時は個別のダウンロードのみにフォールバックする
  const canShareAll =
    typeof navigator !== "undefined" &&
    !!navigator.canShare?.({ files: shareFiles });

  const handleShareAll = () => {
    navigator
      .share({ files: shareFiles })
      .catch(() => {
        // ユーザーによるキャンセルなどは無視する
      });
  };

  return (
    <>
      <ResultGrid>
        {columnImages.map((image, i) => (
          <ResultCell key={i}>
            <img
              src={image.url}
              alt={`分割画像 ${i + 1}`}
              style={{ display: "block", width: percent(100) }}
            />
            <MockActionButton
              action={{
                type: "download",
                href: image.url,
                download: buildFileName(i, timestamp)
              }}
            >
              画像{i + 1}を保存
            </MockActionButton>
          </ResultCell>
        ))}
      </ResultGrid>
      {canShareAll ? (
        <ShareRow>
          <MockActionButton action={{ type: "button", onClick: handleShareAll }}>
            まとめて共有
          </MockActionButton>
        </ShareRow>
      ) : null}
      <BackRow>
        <MockActionButton action={{ type: "button", onClick: onBack }}>
          もどる
        </MockActionButton>
      </BackRow>
    </>
  );
};

export default ImageSplitResultScene;
