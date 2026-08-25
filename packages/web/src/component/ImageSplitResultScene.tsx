import styled from "@emotion/styled";
import { em, percent, px } from "~/common/css-util";
import MockActionButton from "~/component/MockActionButton";

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

const BackRow = styled.div({
  display: "flex",
  justifyContent: "center"
});

const ImageSplitResultScene = ({
  columnImages,
  onBack
}: {
  columnImages: string[];
  onBack: () => void;
}) => (
  <>
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
    <BackRow>
      <MockActionButton action={{ type: "button", onClick: onBack }}>
        もどる
      </MockActionButton>
    </BackRow>
  </>
);

export default ImageSplitResultScene;
