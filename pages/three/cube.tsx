import React, { useMemo } from "react";
import { css } from "@emotion/core";
import Link from "next/link";
import DefaultLayout from "~/layouts/DefaultLayout";
import { px } from "~/lib/cssUtil";
import SampleCubeAgent from "~/lib/SampleCubeAgent";
import FullScreenThree from "~/components/FullScreenThree";

const SWITCH_LINK = "/three/plane/";

const uiStyle = css({
  position: "fixed",
  padding: px(16),
  right: px(16),
  top: px(16),
  backgroundColor: `rgba(0,0,0,0.5)`
});

export default () => {
  const sampleCubeAgent = useMemo(() => new SampleCubeAgent(), []);
  return (
    <DefaultLayout>
      <FullScreenThree agent={sampleCubeAgent} />
      <div css={uiStyle}>
        <Link href={SWITCH_LINK}>
          <a href={SWITCH_LINK}>plane</a>
        </Link>
      </div>
    </DefaultLayout>
  );
};
