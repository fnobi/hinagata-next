import Head from "next/head";
import { type PageMetadata } from "~/common/makeMetadata";

const PageHead = ({ metadata }: { metadata: PageMetadata }) => (
  <Head>
    {metadata.title ? <title>{metadata.title}</title> : null}
    {metadata.description ? (
      <meta name="description" content={metadata.description} />
    ) : null}
    {metadata.keywords?.length ? (
      <meta name="keywords" content={metadata.keywords.join(",")} />
    ) : null}
    <link rel="canonical" href={metadata.canonicalUrl} />
    {metadata.faviconUrl ? <link rel="icon" href={metadata.faviconUrl} /> : null}
    {metadata.appleIconUrl ? (
      <link rel="apple-touch-icon" href={metadata.appleIconUrl} />
    ) : null}
    <meta property="og:url" content={metadata.canonicalUrl} />
    {metadata.title ? <meta property="og:title" content={metadata.title} /> : null}
    {metadata.description ? (
      <meta property="og:description" content={metadata.description} />
    ) : null}
    {metadata.shareImageUrl ? (
      <meta property="og:image" content={metadata.shareImageUrl} />
    ) : null}
    <meta name="twitter:card" content="summary_large_image" />
    {metadata.title ? (
      <meta name="twitter:title" content={metadata.title} />
    ) : null}
    {metadata.description ? (
      <meta name="twitter:description" content={metadata.description} />
    ) : null}
    {metadata.shareImageUrl ? (
      <meta name="twitter:image" content={metadata.shareImageUrl} />
    ) : null}
  </Head>
);

export default PageHead;
