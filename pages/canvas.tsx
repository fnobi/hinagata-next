import { NextPage } from "next";
import dynamic from "next/dynamic";

const SampleCanvasElementView = dynamic(
  () => import("~/components/SampleCanvasElementView"),
  {
    ssr: false
  }
);

const PageCanvas: NextPage = () => <SampleCanvasElementView />;

export default PageCanvas;
