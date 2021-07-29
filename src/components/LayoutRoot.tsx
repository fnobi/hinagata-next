import { ReactNode } from "react";
import emotionReset from "emotion-reset";
import { Global, css } from "@emotion/core";
import { globalStyle } from "~/local/commonCss";

const LayoutRoot = ({ children }: { children: ReactNode }) => (
  <>
    <Global styles={css(emotionReset, globalStyle)} />
    {children}
    {/* <GTagSnippet trackingId="XX-XXXXXXXXX-XX" /> */}
  </>
);

export default LayoutRoot;
