import { type ReactNode } from "react";
import { defaultMetadata } from "~/features/components/DefaultMetaSettings";
import GlobalStyles from "~/features/components/GlobalStyles";
import LayoutRoot from "~/features/components/LayoutRoot";

export const metadata = defaultMetadata;

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="ja">
    <body>
      <GlobalStyles>
        <LayoutRoot>{children}</LayoutRoot>
      </GlobalStyles>
    </body>
  </html>
);

export default RootLayout;
