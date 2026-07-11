import { type StaticImageData } from "next/image";
import type PageEntry from "@hinagata-next/core/common/PageEntry";
import { SITE_ORIGIN } from "~/common/constants";

export type PageMetadata = {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl: string;
  shareImageUrl?: string;
  faviconUrl?: string;
  appleIconUrl?: string;
};

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
}: MetaOptions): PageMetadata => ({
  title,
  description,
  keywords,
  canonicalUrl: page.url,
  shareImageUrl: shareImageAsset ? SITE_ORIGIN + shareImageAsset.src : shareImageUrl,
  faviconUrl,
  appleIconUrl
});

export default makeMetadata;
