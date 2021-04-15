import React from "react";
import Head from "next/head";
import META from "~/local/META";

const MetaSettings = (props: {
  pageTitle?: string;
  pageShareImage?: string;
  pagePath?: string;
}) => {
  const { pageTitle, pageShareImage, pagePath } = props;
  const title = pageTitle ? `${pageTitle} | ${META.TITLE}` : META.TITLE;
  const shareImageUrl = `${process.env.SITE_ORIGIN}${pageShareImage ||
    META.SHARE_IMAGE_PATH}`;
  const canonicalUrl = `${META.URL}${pagePath || "/"}`;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={META.DESCRIPTION} />
      {META.KEYWORDS ? (
        <meta name="keywords" content={META.KEYWORDS.join(",")} />
      ) : null}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={shareImageUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={META.DESCRIPTION} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:image" content={shareImageUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={META.DESCRIPTION} />
      <link rel="canonical" href={canonicalUrl} />
      {META.FAVICON_PATH ? (
        <link rel="icon" type="image/x-icon" href={META.FAVICON_PATH} />
      ) : null}
    </Head>
  );
};

export default MetaSettings;
