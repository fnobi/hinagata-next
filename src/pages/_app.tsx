import { type AppProps } from "next/app";
import { Global, css } from "@emotion/react";
import emotionReset from "emotion-reset";
import { RecoilRoot } from "recoil";
import { globalStyle } from "~/app/lib/emotion-mixin";
import DefaultMetaSettings from "~/app/components/DefaultMetaSettings";
import LayoutRoot from "~/app/components/LayoutRoot";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <RecoilRoot>
    <DefaultMetaSettings />
    <Global styles={css(emotionReset, globalStyle)} />
    <LayoutRoot>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </LayoutRoot>
    {/* <GTagSnippet trackingId="XX-XXXXXXXXX-XX" basePath={BASE_PATH} /> */}
  </RecoilRoot>
);

export default MyApp;
