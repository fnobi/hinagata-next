import dynamic from "next/dynamic";
import { NextPage } from "next";

const SamplePixiView = dynamic(() => import("~/components/SamplePixiView"), {
  ssr: false
});

const PagePixi: NextPage = () => <SamplePixiView />;

export default PagePixi;
