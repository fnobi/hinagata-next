import { type AppProps } from "next/app";
import { Global, css } from "@emotion/react";
import emotionReset from "emotion-reset";
import { globalStyle } from "~/app/lib/emotion-mixin";
import DefaultMetaSettings from "~/app/components/DefaultMetaSettings";
import LayoutRoot from "~/app/components/LayoutRoot";

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
