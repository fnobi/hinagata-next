import React from "react";
import { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import MetaSettings from "~/components/MetaSettings";
import LayoutRoot from "~/components/LayoutRoot";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <RecoilRoot>
    <MetaSettings
      pageTitle={pageProps.pageTitle}
      pageShareImage={pageProps.pageShareImage}
      pagePath={pageProps.pagePath}
    />
    <LayoutRoot>
      <Component {...pageProps} />
    </LayoutRoot>
  </RecoilRoot>
);

export default MyApp;
