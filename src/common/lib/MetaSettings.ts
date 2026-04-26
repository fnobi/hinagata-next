import { type Metadata } from "next";
import type PageEntry from "~/common/lib/PageEntry";

export type MetaOptions = {
  page: PageEntry;
  title?: string;
  description?: string;
  shareImageUrl?: string;
  keywords?: string[];
  faviconUrl?: string;
};

export const makeMetadata = ({
  page,
  title,
  description,
  shareImageUrl,
  keywords,
  faviconUrl
}: MetaOptions): Metadata => {
  const canonicalUrl = page.url;
  return {
    title,
    description,
    keywords,
    icons: faviconUrl ? [{ rel: "icon", url: faviconUrl }] : undefined,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      url: canonicalUrl,
      title,
      description,
      images: shareImageUrl ? [{ url: shareImageUrl }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: shareImageUrl ? [shareImageUrl] : undefined
    }
  };
};
