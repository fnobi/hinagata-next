import {
  Fragment,
  type LinkHTMLAttributes,
  type MetaHTMLAttributes,
  type ReactNode,
  createElement
} from "react";
import Head from "next/head";
import type PageEntry from "~/common/lib/PageEntry";

export type MetaOptions = {
  page: PageEntry;
  title?: string;
  description?: string;
  shareImageUrl?: string;
  keywords?: string[];
  faviconUrl?: string;
  viewport?: string;
};

type MetaTagKey =
  | "meta-title"
  | "meta-description"
  | "meta-keywords"
  | "meta-favicon"
  | "meta-canonical"
  | "meta-viewport"
  | "meta-og-url"
  | "meta-og-title"
  | "meta-og-description"
  | "meta-og-image"
  | "meta-twitter-card"
  | "meta-twitter-title"
  | "meta-twitter-description"
  | "meta-twitter-image";

type MetaTagParam =
  | { type: "title"; title: string }
  | { type: "meta"; attributes: MetaHTMLAttributes<HTMLMetaElement> }
  | { type: "link"; attributes: LinkHTMLAttributes<HTMLLinkElement> };

const convertMetaOptions = ({
  page,
  title,
  description,
  shareImageUrl,
  keywords,
  faviconUrl,
  viewport
}: MetaOptions): Map<MetaTagKey, MetaTagParam> => {
  const canonicalUrl = page.url;
  const params = new Map<MetaTagKey, MetaTagParam>();
  if (title) {
    params.set("meta-title", { type: "title", title });
    params.set("meta-og-title", {
      type: "meta",
      attributes: {
        property: "og:title",
        content: title
      }
    });
    params.set("meta-twitter-title", {
      type: "meta",
      attributes: {
        property: "twitter:title",
        content: title
      }
    });
  }
  if (description) {
    params.set("meta-description", {
      type: "meta",
      attributes: { name: "description", content: description }
    });
    params.set("meta-og-description", {
      type: "meta",
      attributes: { property: "og:description", content: description }
    });
    params.set("meta-twitter-description", {
      type: "meta",
      attributes: { property: "twitter:description", content: description }
    });
  }
  if (keywords && keywords.length) {
    params.set("meta-keywords", {
      type: "meta",
      attributes: {
        name: "keywords",
        content: keywords.join(",")
      }
    });
  }
  if (faviconUrl) {
    params.set("meta-favicon", {
      type: "link",
      attributes: {
        rel: "icon",
        type: "image/x-icon",
        href: faviconUrl
      }
    });
  }
  // TODO: 常に上書きでいいのか?問題
  params.set("meta-twitter-card", {
    type: "meta",
    attributes: {
      property: "twitter:card",
      content: "summary_large_image"
    }
  });
  if (canonicalUrl) {
    params.set("meta-canonical", {
      type: "link",
      attributes: {
        rel: "canonical",
        href: canonicalUrl
      }
    });
    params.set("meta-og-url", {
      type: "meta",
      attributes: {
        property: "og:url",
        content: canonicalUrl
      }
    });
  }
  if (shareImageUrl) {
    params.set("meta-og-image", {
      type: "meta",
      attributes: {
        property: "og:image",
        content: shareImageUrl
      }
    });
    params.set("meta-twitter-image", {
      type: "meta",
      attributes: {
        property: "twitter:image",
        content: shareImageUrl
      }
    });
  }
  if (viewport) {
    params.set("meta-viewport", {
      type: "meta",
      attributes: {
        name: "viewport",
        content: viewport
      }
    });
  }
  return params;
};

const MetaSettings = ({
  children,
  ...options
}: MetaOptions & {
  children?: ReactNode;
}) =>
  createElement(
    Fragment,
    null,
    createElement(
      Head,
      null,
      Array.from(convertMetaOptions(options).entries()).map(([k, v]) => {
        switch (v.type) {
          case "title":
            return createElement("title", { key: k }, v.title);
          default:
            return createElement(v.type, { key: k, ...v.attributes });
        }
      })
    ),
    children
  );

export default MetaSettings;
