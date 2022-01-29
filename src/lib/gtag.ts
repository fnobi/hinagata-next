import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { basePath } from "~/local/constants";

type GTagMethod = {
  event: [
    string,
    {
      // eslint-disable-next-line camelcase
      event_category: string;
      // eslint-disable-next-line camelcase
      event_label?: string;
      // eslint-disable-next-line camelcase
      event_value?: number;
    }
  ];
  config: [
    string,
    {
      // eslint-disable-next-line camelcase
      page_title?: string;
      // eslint-disable-next-line camelcase
      page_location?: string;
      // eslint-disable-next-line camelcase
      page_path?: string;
    }
  ];
};

declare global {
  interface Window {
    gtag: <K extends keyof GTagMethod>(
      type: K,
      payload1: GTagMethod[K][0],
      payload2: GTagMethod[K][1]
    ) => void;
  }
}

type SendEventProps = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

export function sendGAEvent({
  action,
  category,
  label,
  value
}: SendEventProps) {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    event_value: value
  });
}

type SendPageViewProps = {
  id: string;
  pageTitle?: string;
  pageLocation?: string;
  pagePath?: string;
};

export function sendPageView({
  id,
  pageTitle,
  pageLocation,
  pagePath
}: SendPageViewProps) {
  window.gtag("config", id, {
    page_title: pageTitle,
    page_location: pageLocation,
    page_path: pagePath
  });
}

function usePageView(id: string) {
  const landingPathRef = useRef("");
  const route = useRouter();
  useEffect(() => {
    const { current: landingPath } = landingPathRef;
    const pagePath = basePath + route.asPath;
    if (landingPath) {
      sendPageView({
        id,
        pagePath
      });
    } else {
      landingPathRef.current = pagePath;
    }
  }, [route.asPath, id]);
}

export function GTagSnippet(props: { trackingId: string }) {
  const { trackingId } = props;
  usePageView(trackingId);

  const snippet = `
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "${trackingId}");`;

  return React.createElement(
    React.Fragment,
    null,
    React.createElement("script", {
      async: true,
      src: `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
    }),
    React.createElement("script", {
      dangerouslySetInnerHTML: {
        __html: snippet
      }
    })
  );
}
