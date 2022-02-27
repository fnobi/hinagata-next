import { useMemo } from "react";
import { css } from "@emotion/react";
import Link from "next/link";
import { px } from "~/lib/cssUtil";
import { NextPage } from "next";
import SamplePlaneAgent from "~/local/SamplePlaneAgent";
import FullScreenThree from "~/components/FullScreenThree";

const SWITCH_LINK = "/three/cube/";

const uiStyle = css({
  position: "fixed",
  padding: px(16),
  right: px(16),
  top: px(16),
  backgroundColor: `rgba(0,0,0,0.5)`
});

const PageThreePlane: NextPage = () => {
  const samplePlaneAgent = useMemo(() => new SamplePlaneAgent(), []);
  return (
    <div>
      <FullScreenThree agent={samplePlaneAgent} />
      <div css={uiStyle}>
        <Link href={SWITCH_LINK}>
          <a href={SWITCH_LINK}>cube</a>
        </Link>
      </div>
    </div>
  );
};

export default PageThreePlane;
