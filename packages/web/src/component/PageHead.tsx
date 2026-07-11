import Head from "next/head";
import { type Metadata } from "next";

const metadataTitleToString = (title: Metadata["title"]) => {
  if (!title) {
    return undefined;
  }
  if (typeof title === "string") {
    return title;
  }
  if ("absolute" in title && title.absolute) {
    return title.absolute;
  }
  if ("default" in title) {
    return title.default;
  }
  return undefined;
};

const hasUrl = (value: unknown): value is { url?: { toString: () => string } } =>
  typeof value === "object" && value !== null && "url" in value;

const firstImageUrl = (images: unknown) => {
  if (!images) {
    return undefined;
  }
  const firstImage = Array.isArray(images) ? images[0] : images;
  if (typeof firstImage === "string" || firstImage instanceof URL) {
    return firstImage.toString();
  }
  if (hasUrl(firstImage)) {
    return firstImage.url?.toString();
  }
  return undefined;
};

const urlString = (value: unknown): string | undefined => {
  if (!value) {
    return undefined;
  }
  if (typeof value === "string" || value instanceof URL) {
    return value.toString();
  }
  if (hasUrl(value)) {
    return value.url?.toString();
  }
  return undefined;
};

const iconUrl = (icons: Metadata["icons"]) => {
  if (!icons) {
    return undefined;
  }
  if (Array.isArray(icons)) {
    return urlString(icons[0]);
  }
  if (typeof icons === "object" && !(icons instanceof URL) && "icon" in icons) {
    return urlString(icons.icon);
  }
  return urlString(icons);
};

const PageHead = ({ metadata }: { metadata: Metadata }) => {
  const title = metadataTitleToString(metadata.title);
  const description = metadata.description ?? undefined;
  const keywords = Array.isArray(metadata.keywords)
    ? metadata.keywords.join(",")
    : metadata.keywords;
  const canonical = metadata.alternates?.canonical?.toString();
  const openGraph = metadata.openGraph;
  const twitter = metadata.twitter;
  const ogImage = firstImageUrl(openGraph?.images);
  const twitterImage = Array.isArray(twitter?.images)
    ? twitter.images[0]?.toString()
    : twitter?.images?.toString();

  return (
    <Head>
      {title ? <title>{title}</title> : null}
      {description ? <meta name="description" content={description} /> : null}
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      {iconUrl(metadata.icons) ? (
        <link rel="icon" href={iconUrl(metadata.icons)} />
      ) : null}
      {openGraph?.url ? (
        <meta property="og:url" content={openGraph.url.toString()} />
      ) : null}
      {openGraph?.title ? (
        <meta property="og:title" content={openGraph.title.toString()} />
      ) : null}
      {openGraph?.description ? (
        <meta
          property="og:description"
          content={openGraph.description.toString()}
        />
      ) : null}
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      {twitter && "card" in twitter && twitter.card ? (
        <meta name="twitter:card" content={twitter.card} />
      ) : null}
      {twitter && "title" in twitter && twitter.title ? (
        <meta name="twitter:title" content={twitter.title.toString()} />
      ) : null}
      {twitter && "description" in twitter && twitter.description ? (
        <meta
          name="twitter:description"
          content={twitter.description.toString()}
        />
      ) : null}
      {twitterImage ? (
        <meta name="twitter:image" content={twitterImage} />
      ) : null}
    </Head>
  );
};

export default PageHead;
