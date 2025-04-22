import { useRouter } from "next/router";
import Script from "next/script";
import React, { useEffect, useRef } from "react";

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

export const sendGAEvent = ({
  action,
  category,
  label,
  value
}: SendEventProps) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    event_value: value
  });
};

type SendPageViewProps = {
  id: string;
  pageTitle?: string;
  pageLocation?: string;
  pagePath?: string;
};

export const sendPageView = ({
  id,
  pageTitle,
  pageLocation,
  pagePath
}: SendPageViewProps) =>
  window.gtag("config", id, {
    page_title: pageTitle,
    page_location: pageLocation,
    page_path: pagePath
  });

const usePageView = (id: string, basePath: string) => {
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
  }, [route.asPath, id, basePath]);
};

export const GTagSnippet = ({
  trackingId,
  basePath
}: {
  trackingId: string;
  basePath: string;
}) => {
  usePageView(trackingId, basePath);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Script, {
      async: true,
      src: `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
    }),
    React.createElement(
      Script,
      null,
      `
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "${trackingId}");`
    )
  );
};
