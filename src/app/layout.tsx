import { type ReactNode } from "react";
import { defaultMetadata } from "~/features/lib/defaultMetadata";
import GlobalStyles from "~/features/components/GlobalStyles";
import LayoutRoot from "~/features/components/LayoutRoot";

export const metadata = defaultMetadata;

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="ja">
    <body>
      <GlobalStyles />
      <LayoutRoot>{children}</LayoutRoot>
    </body>
  </html>
);

export default RootLayout;
