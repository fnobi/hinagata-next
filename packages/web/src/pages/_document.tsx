import createEmotionServer from "@emotion/server/create-instance";
import { type AppType } from "next/app";
import NextDocument, {
  type DocumentContext,
  type DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript
} from "next/document";
import { type ReactNode } from "react";
import { type AppPropsWithEmotion } from "~/pages/_app";
import createEmotionCache from "~/common/emotion-cache";

type Props = DocumentInitialProps & { emotionStyleTags: ReactNode[] };

const Document = ({ emotionStyleTags }: Props) => (
  <Html lang="ja">
    <Head>
      {/* ページで使う Emotion の CSS。JS より先に効かせ、読み込み直後のスタイル崩れを防ぐ */}
      {emotionStyleTags}
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

Document.getInitialProps = async (ctx: DocumentContext): Promise<Props> => {
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => {
        const AppWithEmotion = App as AppType<AppPropsWithEmotion["pageProps"]>;
        const EnhancedApp = (props: AppPropsWithEmotion) => (
          <AppWithEmotion emotionCache={cache} {...props} />
        );
        return EnhancedApp;
      }
    });
  const initialProps = await NextDocument.getInitialProps(ctx);
  const { styles } = extractCriticalToChunks(initialProps.html);
  return {
    ...initialProps,
    emotionStyleTags: styles.map(style => (
      <style
        key={style.key}
        data-emotion={`${style.key} ${style.ids.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ))
  };
};

export default Document;
