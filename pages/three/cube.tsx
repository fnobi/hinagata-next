import { useMemo } from "react";
import { css } from "@emotion/react";
import Link from "next/link";
import { px } from "~/lib/cssUtil";
import { NextPage } from "next";
import SampleCubeAgent from "~/local/SampleCubeAgent";
import FullScreenThree from "~/components/FullScreenThree";

const SWITCH_LINK = "/three/plane/";

const uiStyle = css({
  position: "fixed",
  padding: px(16),
  right: px(16),
  top: px(16),
  backgroundColor: `rgba(0,0,0,0.5)`
});

const PageThreeCube: NextPage = () => {
  const sampleCubeAgent = useMemo(() => new SampleCubeAgent(), []);
  return (
    <div>
      <FullScreenThree agent={sampleCubeAgent} />
      <div css={uiStyle}>
        <Link href={SWITCH_LINK}>
          <a href={SWITCH_LINK}>plane</a>
        </Link>
      </div>
    </div>
  );
};

export default PageThreeCube;
