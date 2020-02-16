import React, { useMemo } from "react";
import { css } from "@emotion/core";
import Link from "next/link";
import { px } from "~/lib/cssUtil";
import SamplePlaneAgent from "~/local/SamplePlaneAgent";
import DefaultLayout from "~/layouts/DefaultLayout";
import FullScreenThree from "~/components/FullScreenThree";

const SWITCH_LINK = "/three/cube/";

const uiStyle = css({
  position: "fixed",
  padding: px(16),
  right: px(16),
  top: px(16),
  backgroundColor: `rgba(0,0,0,0.5)`
});

export default () => {
  const samplePlaneAgent = useMemo(() => new SamplePlaneAgent(), []);
  return (
    <DefaultLayout>
      <FullScreenThree agent={samplePlaneAgent} />
      <div css={uiStyle}>
        <Link href={SWITCH_LINK}>
          <a href={SWITCH_LINK}>cube</a>
        </Link>
      </div>
    </DefaultLayout>
  );
};
