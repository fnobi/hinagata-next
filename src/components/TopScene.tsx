import { FC } from "react";
import { css } from "@emotion/react";
import { percent, em } from "~/lib/cssUtil";

const wrapperStyle = css({
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  top: percent(0),
  left: percent(0),
  width: percent(100),
  height: percent(100)
});

const titleStyle = css({
  fontWeight: "bold",
  marginBottom: em(0.5)
});

const TopScene: FC = () => (
  <div css={wrapperStyle}>
    <div css={titleStyle}>Welcome to Next.js!</div>
  </div>
);

export default TopScene;
