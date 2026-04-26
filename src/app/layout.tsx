import { type ReactNode } from "react";
import { defaultMetadata } from "~/features/components/DefaultMetaSettings";
import EmotionProvider from "~/features/components/EmotionProvider";
import LayoutRoot from "~/features/components/LayoutRoot";

export const metadata = defaultMetadata;

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="ja">
    <body>
      <EmotionProvider>
        <LayoutRoot>{children}</LayoutRoot>
      </EmotionProvider>
    </body>
  </html>
);

export default RootLayout;
