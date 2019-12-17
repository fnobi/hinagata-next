import React, { useMemo } from "react";
import { css } from "@emotion/core";
import Link from "next/link";
import DefaultLayout from "~/layouts/DefaultLayout";
import { px } from "~/lib/cssUtil";
import ThreeFullScreen from "~/lib/ThreeFullScreen";
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
  const threeFullScreen = useMemo(() => new ThreeFullScreen(), []);
  return (
    <DefaultLayout>
      <FullScreenThree agent={threeFullScreen} />
      <div css={uiStyle}>
        <Link href={SWITCH_LINK}>
          <a href={SWITCH_LINK}>cube</a>
        </Link>
      </div>
    </DefaultLayout>
  );
};
