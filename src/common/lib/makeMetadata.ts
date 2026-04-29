import { type Metadata } from "next";
import { type StaticImageData } from "next/image";
import { SITE_ORIGIN } from "~/common/lib/constants";
import type PageEntry from "~/common/lib/PageEntry";

type MetaOptions = {
  page: PageEntry;
  title?: string;
  description?: string;
  shareImageUrl?: string;
  shareImageAsset?: StaticImageData;
  keywords?: string[];
  faviconUrl?: string;
  appleIconUrl?: string;
};

const makeMetadata = ({
  page,
  title,
  description,
  shareImageUrl,
  shareImageAsset,
  keywords,
  faviconUrl,
  appleIconUrl
}: MetaOptions): Metadata => {
  const canonicalUrl = page.url;
  const shareImage = shareImageAsset
    ? SITE_ORIGIN + shareImageAsset.src
    : shareImageUrl;
  return {
    title,
    description,
    keywords,
    icons:
      faviconUrl || appleIconUrl
        ? { icon: faviconUrl, apple: appleIconUrl }
        : undefined,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      url: canonicalUrl,
      title,
      description,
      images: shareImage ? [{ url: shareImage }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: shareImage ? [shareImage] : undefined
    }
  };
};

export default makeMetadata;
