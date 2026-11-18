import { type EmotionCache } from "@emotion/cache";
import { type AppProps } from "next/app";
import { defaultMetadata } from "~/feature/defaultMetadata";
import EmotionProvider from "~/component/EmotionProvider";
import GlobalStyles from "~/component/GlobalStyles";
import LayoutRoot from "~/component/LayoutRoot";
import PageMeta from "~/component/PageMeta";

export type AppPropsWithEmotion = AppProps & {
  /** サーバーで描画するとき、_document が渡す（CSS を書き出すため） */
  emotionCache?: EmotionCache;
};

const App = ({ Component, pageProps, emotionCache }: AppPropsWithEmotion) => (
  <EmotionProvider cache={emotionCache}>
    <PageMeta metadata={defaultMetadata}>
      <GlobalStyles />
      <LayoutRoot>
        <Component {...pageProps} />
      </LayoutRoot>
    </PageMeta>
  </EmotionProvider>
);

export default App;
