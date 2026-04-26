import { type AppProps } from "next/app";
import { Global, css } from "@emotion/react";
import emotionReset from "emotion-reset";
import { globalStyle } from "~/features/lib/emotion-mixin";
import DefaultMetaSettings from "~/features/components/DefaultMetaSettings";
import LayoutRoot from "~/features/components/LayoutRoot";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <DefaultMetaSettings />
    <Global styles={css(emotionReset, globalStyle)} />
    <LayoutRoot>
      <Component {...pageProps} />
    </LayoutRoot>
    {/* <GTagSnippet trackingId="XX-XXXXXXXXX-XX" basePath={BASE_PATH} /> */}
  </>
);

export default MyApp;
