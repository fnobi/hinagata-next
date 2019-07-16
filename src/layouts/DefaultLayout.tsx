import React from "react";
import Head from "next/head";
import emotionReset from "emotion-reset";
import { Global, css } from "@emotion/core";
import META from "~/meta";

export default (({ children }) => (
  <div>
    <Head>
      <title>{META.TITLE}</title>
      <meta name="viewport" content="width=device-width initial-scale=1" />
      <meta name="description" content={META.DESCRIPTION} />
      <meta name="keywords" content={META.KEYWORDS.join(",")} />
      <meta property="og:url" content={META.URL} />
      <meta property="og:image" content={META.SHARE_IMAGE_URL} />
      <meta property="og:title" content={META.TITLE} />
      <meta property="og:description" content={META.DESCRIPTION} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:image" content={META.SHARE_IMAGE_URL} />
      <meta property="twitter:title" content={META.TITLE} />
      <meta property="twitter:description" content={META.DESCRIPTION} />
      <link rel="canonical" href={META.URL} />
      <link rel="icon" type="image/x-icon" href={META.FAVICON_PATH} />
    </Head>
    <Global styles={css(emotionReset)} />
    {children}
  </div>
)) as React.FunctionComponent;
