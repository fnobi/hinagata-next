import { type AppProps } from "next/app";
import { defaultMetadata } from "~/feature/defaultMetadata";
import EmotionProvider from "~/component/EmotionProvider";
import GlobalStyles from "~/component/GlobalStyles";
import LayoutRoot from "~/component/LayoutRoot";
import PageMeta from "~/component/PageMeta";

const App = ({ Component, pageProps }: AppProps) => (
  <EmotionProvider>
    <PageMeta metadata={defaultMetadata}>
      <GlobalStyles />
      <LayoutRoot>
        <Component {...pageProps} />
      </LayoutRoot>
    </PageMeta>
  </EmotionProvider>
);

export default App;
