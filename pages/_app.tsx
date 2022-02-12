import { AppProps } from "next/app";
import { Global, css } from "@emotion/react";
import emotionReset from "emotion-reset";
import { RecoilRoot } from "recoil";
import { globalStyle } from "~/local/emotionMixin";
import MetaSettings from "~/components/MetaSettings";
import LayoutRoot from "~/components/LayoutRoot";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <RecoilRoot>
    <MetaSettings
      pageTitle={pageProps.pageTitle}
      pageShareImage={pageProps.pageShareImage}
      pagePath={pageProps.pagePath}
    />
    <Global styles={css(emotionReset, globalStyle)} />
    <LayoutRoot>
      <Component {...pageProps} />
    </LayoutRoot>
    {/* <GTagSnippet trackingId="XX-XXXXXXXXX-XX" /> */}
  </RecoilRoot>
);

export default MyApp;
