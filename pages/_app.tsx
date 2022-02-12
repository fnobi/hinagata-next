import { AppProps } from "next/app";
import { Global, css } from "@emotion/react";
import emotionReset from "emotion-reset";
import { RecoilRoot } from "recoil";
import { globalStyle } from "~/local/emotionMixin";
import DefaultMetaSettings from "~/components/DefaultMetaSettings";
import LayoutRoot from "~/components/LayoutRoot";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <RecoilRoot>
    <DefaultMetaSettings />
    <Global styles={css(emotionReset, globalStyle)} />
    <LayoutRoot>
      <Component {...pageProps} />
    </LayoutRoot>
    {/* <GTagSnippet trackingId="XX-XXXXXXXXX-XX" /> */}
  </RecoilRoot>
);

export default MyApp;
