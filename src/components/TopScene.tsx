import { useState, MouseEvent, FC } from "react";
import { css } from "@emotion/react";
import { percent, em } from "~/lib/css-util";
import useSampleCounter from "~/local/useSampleCounter";
import { PAGE_ABOUT } from "~/local/page-path";
import PageLink from "~/components/PageLink";

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

const textLinkStyle = css({
  color: "inherit"
});

const TopScene: FC = () => {
  const [mouse, setMouse] = useState<[number, number]>([0, 0]);
  const [count, increment] = useSampleCounter();

  const updateMouse = (e: MouseEvent) => {
    setMouse([e.pageX, e.pageY]);
  };

  return (
    <div css={wrapperStyle} onMouseMove={updateMouse}>
      <div css={titleStyle}>Welcome to Next.js!</div>
      <button type="button" onClick={increment}>
        count up:{count}
      </button>
      <p>
        <PageLink page={PAGE_ABOUT} css={textLinkStyle}>
          about
        </PageLink>
      </p>
      <p>{mouse.join(",")}</p>
    </div>
  );
};

export default TopScene;
