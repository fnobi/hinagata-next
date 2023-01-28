import { FC, PropsWithChildren } from "react";
import Head from "next/head";
import { StaticImageData } from "next/image";
import PageEntry from "~/lib/PageEntry";
import { SITE_ORIGIN } from "~/local/constants";

const MetaSettings: FC<
  PropsWithChildren<{
    page: PageEntry;
    title?: string;
    description?: string;
    shareImage?: StaticImageData;
    customShareImageUrl?: string;
    keywords?: string[];
    favicon?: StaticImageData;
    viewport?: string;
  }>
> = ({
  page,
  title,
  description,
  shareImage,
  customShareImageUrl,
  favicon,
  keywords,
  viewport = "width=device-width",
  children
}) => {
  const shareImageUrl =
    customShareImageUrl || (shareImage ? SITE_ORIGIN + shareImage.src : null);
  const canonicalUrl = page.url;
  return (
    <>
      <Head>
        {title ? (
          <>
            <title key="meta-title">{title}</title>
            <meta key="meta-og-title" property="og:title" content={title} />
            <meta
              key="meta-twitter-title"
              property="twitter:title"
              content={title}
            />
          </>
        ) : null}
        {description ? (
          <>
            <meta name="description" content={description} />
            <meta
              key="meta-og-description"
              property="og:description"
              content={description}
            />
            <meta
              key="meta-twitter-description"
              property="twitter:description"
              content={description}
            />
          </>
        ) : null}
        {keywords && keywords.length ? (
          <meta
            key="meta-keywords"
            name="keywords"
            content={keywords.join(",")}
          />
        ) : null}
        {favicon ? (
          <link
            key="meta-favicon"
            rel="icon"
            type="image/x-icon"
            href={favicon.src}
          />
        ) : null}
        <meta
          key="meta-twitter-card"
          property="twitter:card"
          content="summary_large_image"
        />
        {canonicalUrl ? (
          <>
            <link key="meta-canonical" rel="canonical" href={canonicalUrl} />
            <meta key="meta-og-url" property="og:url" content={canonicalUrl} />
          </>
        ) : null}
        {shareImageUrl ? (
          <>
            <meta
              key="meta-og-image"
              property="og:image"
              content={shareImageUrl}
            />
            <meta
              key="meta-twitter-image"
              property="twitter:image"
              content={shareImageUrl}
            />
          </>
        ) : null}
        <meta key="viewport" name="viewport" content={viewport} />
      </Head>
      {children}
    </>
  );
};

export default MetaSettings;
