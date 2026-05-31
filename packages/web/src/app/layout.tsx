import { type ReactNode } from "react";
import { defaultMetadata } from "~/feature/defaultMetadata";
import EmotionProvider from "~/component/EmotionProvider";
import GlobalStyles from "~/component/GlobalStyles";
import LayoutRoot from "~/component/LayoutRoot";

export const metadata = defaultMetadata;

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="ja">
    <body>
      <EmotionProvider>
        <GlobalStyles />
        <LayoutRoot>{children}</LayoutRoot>
      </EmotionProvider>
    </body>
  </html>
);

export default RootLayout;
