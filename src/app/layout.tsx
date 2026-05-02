import { type ReactNode } from "react";
import EmotionProvider from "~/common/components/EmotionProvider";
import { defaultMetadata } from "~/features/lib/defaultMetadata";
import GlobalStyles from "~/features/components/GlobalStyles";

export const metadata = defaultMetadata;

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="ja">
    <body>
      <EmotionProvider>
        <GlobalStyles />
        {children}
      </EmotionProvider>
    </body>
  </html>
);

export default RootLayout;
