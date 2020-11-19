import React from "react";
import dynamic from "next/dynamic";
import initSamplePlayer from "~/local/initSamplePlayer";

const PlayerCanvas = dynamic(() => import("~/components/PlayerCanvas"), {
  ssr: false
});

const PageCanvas = () => <PlayerCanvas initializer={initSamplePlayer} />;

export default PageCanvas;
