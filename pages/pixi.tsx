import React from "react";
import dynamic from "next/dynamic";

const SamplePixiView = dynamic(() => import("~/components/SamplePixiView"), {
  ssr: false
});

const PagePixi = () => <SamplePixiView />;

export default PagePixi;
