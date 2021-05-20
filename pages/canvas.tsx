import React from "react";
import dynamic from "next/dynamic";

const SampleCanvasElementView = dynamic(
  () => import("~/components/SampleCanvasElementView"),
  {
    ssr: false
  }
);

const PageCanvas = () => <SampleCanvasElementView />;

export default PageCanvas;
