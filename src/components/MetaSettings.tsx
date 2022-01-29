import { FC } from "react";
import Head from "next/head";
import META from "~/local/META";

export type ImageMetaField = {
  src: string;
  height: number;
  width: number;
};

export type PageMetaExtend = {
  pageTitle?: string;
  pageShareImage?: ImageMetaField;
  pagePath?: string;
};

const MetaSettings: FC<PageMetaExtend> = ({
  pageTitle,
  pageShareImage,
  pagePath
}) => {
  const title = pageTitle ? `${pageTitle} | ${META.TITLE}` : META.TITLE;
  const description = META.DESCRIPTION;
  const shareImagePath =
    (pageShareImage ? pageShareImage.src : null) ||
    (META.DEFAULT_SHARE_IMAGE ? META.DEFAULT_SHARE_IMAGE.src : null);
  const shareImageUrl = shareImagePath
    ? `${process.env.SITE_ORIGIN}${shareImagePath}`
    : null;
  const canonicalUrl = `${META.URL}${pagePath || "/"}`;
  return (
    <Head>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      {META.KEYWORDS ? (
        <meta name="keywords" content={META.KEYWORDS.join(",")} />
      ) : null}
      <meta property="og:url" content={canonicalUrl} />
      {shareImageUrl ? (
        <meta property="og:image" content={shareImageUrl} />
      ) : null}
      <meta property="og:title" content={title} />
      {description ? (
        <meta property="og:description" content={description} />
      ) : null}
      <meta property="twitter:card" content="summary_large_image" />
      {shareImageUrl ? (
        <meta property="twitter:image" content={shareImageUrl} />
      ) : null}
      <meta property="twitter:title" content={title} />
      {description ? (
        <meta property="twitter:description" content={description} />
      ) : null}
      <link rel="canonical" href={canonicalUrl} />
      {META.FAVICON_IMAGE ? (
        <link rel="icon" type="image/x-icon" href={META.FAVICON_IMAGE.src} />
      ) : null}
    </Head>
  );
};

export default MetaSettings;
