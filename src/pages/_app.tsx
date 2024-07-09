import { type AppProps } from "next/app";
import { Global, css } from "@emotion/react";
import emotionReset from "emotion-reset";
import { RecoilRoot } from "recoil";
import { globalStyle } from "~/local/emotion-mixin";
import DefaultMetaSettings from "~/components/DefaultMetaSettings";
import LayoutRoot from "~/components/LayoutRoot";

function MyApp({ Component, pageProps }: AppProps) {
  return (
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
}

export default MyApp;
