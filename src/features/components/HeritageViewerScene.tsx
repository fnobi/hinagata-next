"use client";

import { useState, useCallback } from "react";
import styled from "@emotion/styled";
import { HERITAGE_SITES, type HeritageSite } from "~/features/schema/HeritageSite";
import HeritageMap, { type FocusRequest } from "~/features/components/HeritageMap";

const VIDEO_ID = "3_zB4k1rcVk";

const Root = styled.div({
  display: "flex",
  height: "100dvh",
  background: "#0e0e0e",
  color: "#f0f0f0",
  overflow: "hidden"
});

const Sidebar = styled.div({
  width: 260,
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  borderRight: "1px solid #2a2a2a",
  overflow: "hidden"
});

const SidebarHeader = styled.div({
  padding: "18px 16px 12px",
  borderBottom: "1px solid #2a2a2a",
  flexShrink: 0
});

const SidebarTitle = styled.h1({
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.08em",
  color: "#bbb",
  margin: 0
});

const SidebarCount = styled.p({
  fontSize: 11,
  color: "#555",
  margin: "4px 0 0"
});

const SiteList = styled.ul({
  listStyle: "none",
  margin: 0,
  padding: "6px 0",
  overflowY: "auto",
  flex: 1,
  scrollbarWidth: "thin",
  scrollbarColor: "#333 transparent"
});

const SiteItem = styled.li<{ active: boolean }>(({ active }) => ({
  cursor: "pointer",
  padding: "9px 16px",
  borderLeft: active ? "3px solid #e0aa3e" : "3px solid transparent",
  background: active ? "rgba(224,170,62,0.08)" : "transparent",
  transition: "background 0.15s",
  "&:hover": {
    background: active ? "rgba(224,170,62,0.12)" : "rgba(255,255,255,0.04)"
  }
}));

const SiteItemInner = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 8
});

const SiteNumber = styled.span<{ active: boolean }>(({ active }) => ({
  flexShrink: 0,
  width: 22,
  height: 22,
  borderRadius: "50%",
  background: active ? "#e0aa3e" : "#2a2a2a",
  color: active ? "#111" : "#888",
  fontSize: 9,
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1
}));

const SiteNameJa = styled.span<{ active: boolean }>(({ active }) => ({
  display: "block",
  fontSize: 12,
  fontWeight: active ? 700 : 400,
  color: active ? "#e0aa3e" : "#ccc",
  lineHeight: 1.4
}));

const SiteNameEn = styled.span({
  display: "block",
  fontSize: 10,
  color: "#555",
  marginTop: 1
});

const MapArea = styled.div({
  flex: 1,
  overflow: "hidden",
  position: "relative"
});

const VideoOverlay = styled.div({
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  background: "#000",
  zIndex: 10
});

const VideoOverlayHeader = styled.div({
  padding: "10px 14px",
  background: "rgba(0,0,0,0.85)",
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexShrink: 0
});

const VideoNameJa = styled.span({
  fontSize: 15,
  fontWeight: 700,
  color: "#f0f0f0"
});

const VideoNameEn = styled.span({
  fontSize: 11,
  color: "#666",
  marginLeft: 6
});

const CloseButton = styled.button({
  marginLeft: "auto",
  background: "none",
  border: "none",
  color: "#888",
  cursor: "pointer",
  fontSize: 18,
  padding: "2px 4px",
  lineHeight: 1,
  "&:hover": { color: "#fff" }
});

const IframeWrapper = styled.div({
  flex: 1,
  "& iframe": {
    width: "100%",
    height: "100%",
    border: "none",
    display: "block"
  }
});

const buildEmbedUrl = (site: HeritageSite) =>
  `https://www.youtube.com/embed/${VIDEO_ID}?start=${site.startSec}&autoplay=1`;

const SORTED_SITES = [...HERITAGE_SITES].sort((a, b) => a.lng - b.lng);
const SITE_ORDER: Record<string, number> = Object.fromEntries(
  SORTED_SITES.map((s, i) => [s.nameEn, i + 1])
);

const HeritageViewerScene = () => {
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null);
  const [videoSite, setVideoSite] = useState<HeritageSite | null>(null);

  const handleListClick = useCallback((site: HeritageSite) => {
    setFocusRequest({ site, id: Date.now() });
  }, []);

  const handlePlayVideo = useCallback((site: HeritageSite) => {
    setVideoSite(site);
  }, []);

  return (
    <Root>
      <Sidebar>
        <SidebarHeader>
          <SidebarTitle>世界遺産・絶景ビューア</SidebarTitle>
          <SidebarCount>{HERITAGE_SITES.length} か所</SidebarCount>
        </SidebarHeader>
        <SiteList>
          {SORTED_SITES.map(site => {
            const active = videoSite?.nameEn === site.nameEn;
            const num = SITE_ORDER[site.nameEn];
            return (
              <SiteItem key={site.nameEn} active={active} onClick={() => handleListClick(site)}>
                <SiteItemInner>
                  <SiteNumber active={active}>{num}</SiteNumber>
                  <div>
                    <SiteNameJa active={active}>{site.nameJa}</SiteNameJa>
                    <SiteNameEn>{site.nameEn}</SiteNameEn>
                  </div>
                </SiteItemInner>
              </SiteItem>
            );
          })}
        </SiteList>
      </Sidebar>

      <MapArea>
        <HeritageMap focusRequest={focusRequest} onPlayVideo={handlePlayVideo} siteOrder={SITE_ORDER} />
        {videoSite && (
          <VideoOverlay>
            <VideoOverlayHeader>
              <div>
                <VideoNameJa>{videoSite.nameJa}</VideoNameJa>
                <VideoNameEn>{videoSite.nameEn}</VideoNameEn>
              </div>
              <CloseButton onClick={() => setVideoSite(null)}>✕</CloseButton>
            </VideoOverlayHeader>
            <IframeWrapper>
              <iframe
                key={videoSite.nameEn}
                src={buildEmbedUrl(videoSite)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={videoSite.nameJa}
              />
            </IframeWrapper>
          </VideoOverlay>
        )}
      </MapArea>
    </Root>
  );
};

export default HeritageViewerScene;
