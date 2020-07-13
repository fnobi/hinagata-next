import React, { ReactNode } from "react";
import Head from "next/head";
import emotionReset from "emotion-reset";
import { Global, css } from "@emotion/core";
import { globalStyle } from "~/local/commonCss";
import META from "~/local/meta";

const DefaultLayout = (props: {
  title?: string;
  shareImage?: string;
  children: ReactNode;
}) => {
  const { children, title: pageTitle, shareImage: pageShareImage } = props;
  const title = pageTitle ? `${pageTitle} | ${META.TITLE}` : META.TITLE;
  const shareImageUrl = `${URL}${pageShareImage || META.SHARE_IMAGE_PATH}`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width initial-scale=1" />
        <meta name="description" content={META.DESCRIPTION} />
        {META.KEYWORDS ? (
          <meta name="keywords" content={META.KEYWORDS.join(",")} />
        ) : null}
        <meta property="og:url" content={META.URL} />
        <meta property="og:image" content={shareImageUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={META.DESCRIPTION} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:image" content={shareImageUrl} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={META.DESCRIPTION} />
        <link rel="canonical" href={META.URL} />
        {META.FAVICON_PATH ? (
          <link rel="icon" type="image/x-icon" href={META.FAVICON_PATH} />
        ) : null}
      </Head>
      <Global styles={css(emotionReset, globalStyle)} />
      {children}
      {/* <GTagSnippet trackingId="XX-XXXXXXXXX-XX" /> */}
    </>
  );
};

export default DefaultLayout;
