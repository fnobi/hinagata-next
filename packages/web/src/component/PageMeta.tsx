import Head from "next/head";
import { type ReactNode } from "react";
import { type PageMetadata } from "~/common/makeMetadata";

const PageMeta = ({
  children,
  metadata
}: {
  children: ReactNode;
  metadata: PageMetadata;
}) => (
  <>
    <Head>
      {metadata.title ? <title>{metadata.title}</title> : null}
      {metadata.description ? (
        <meta
          key="description"
          name="description"
          content={metadata.description}
        />
      ) : null}
      {metadata.keywords?.length ? (
        <meta
          key="keywords"
          name="keywords"
          content={metadata.keywords.join(",")}
        />
      ) : null}
      <link key="canonical" rel="canonical" href={metadata.canonicalUrl} />
      {metadata.faviconUrl ? (
        <link key="icon" rel="icon" href={metadata.faviconUrl} />
      ) : null}
      {metadata.appleIconUrl ? (
        <link
          key="apple-touch-icon"
          rel="apple-touch-icon"
          href={metadata.appleIconUrl}
        />
      ) : null}
      <meta key="og:url" property="og:url" content={metadata.canonicalUrl} />
      {metadata.title ? (
        <meta key="og:title" property="og:title" content={metadata.title} />
      ) : null}
      {metadata.description ? (
        <meta
          key="og:description"
          property="og:description"
          content={metadata.description}
        />
      ) : null}
      {metadata.shareImageUrl ? (
        <meta
          key="og:image"
          property="og:image"
          content={metadata.shareImageUrl}
        />
      ) : null}
      <meta
        key="twitter:card"
        name="twitter:card"
        content="summary_large_image"
      />
      {metadata.title ? (
        <meta key="twitter:title" name="twitter:title" content={metadata.title} />
      ) : null}
      {metadata.description ? (
        <meta
          key="twitter:description"
          name="twitter:description"
          content={metadata.description}
        />
      ) : null}
      {metadata.shareImageUrl ? (
        <meta
          key="twitter:image"
          name="twitter:image"
          content={metadata.shareImageUrl}
        />
      ) : null}
    </Head>
    {children}
  </>
);

export default PageMeta;
