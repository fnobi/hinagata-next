import { type AppProps } from "next/app";
import { defaultMetadata } from "~/feature/defaultMetadata";
import EmotionProvider from "~/component/EmotionProvider";
import GlobalStyles from "~/component/GlobalStyles";
import LayoutRoot from "~/component/LayoutRoot";
import PageHead from "~/component/PageHead";

const App = ({ Component, pageProps }: AppProps) => (
  <EmotionProvider>
    <PageHead metadata={defaultMetadata} />
    <GlobalStyles />
    <LayoutRoot>
      <Component {...pageProps} />
    </LayoutRoot>
  </EmotionProvider>
);

export default App;
