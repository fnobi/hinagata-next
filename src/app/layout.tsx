import { type ReactNode } from "react";
import EmotionProvider from "~/common/components/EmotionProvider";
import { defaultMetadata } from "~/features/lib/defaultMetadata";
import GlobalStyles from "~/features/components/GlobalStyles";
import LayoutRoot from "~/features/components/LayoutRoot";

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
