"use client";

import { useState } from "react";
import styled from "@emotion/styled";
import { HERITAGE_SITES, type HeritageSite } from "~/features/schema/HeritageSite";

const VIDEO_ID = "3_zB4k1rcVk";

const Root = styled.div({
  display: "flex",
  height: "100dvh",
  background: "#0e0e0e",
  color: "#f0f0f0",
  fontFamily: "sans-serif",
  overflow: "hidden"
});

const Sidebar = styled.div({
  width: 280,
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  borderRight: "1px solid #2a2a2a",
  overflow: "hidden"
});

const SidebarHeader = styled.div({
  padding: "20px 16px 12px",
  borderBottom: "1px solid #2a2a2a",
  flexShrink: 0
});

const SidebarTitle = styled.h1({
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: "0.08em",
  color: "#ccc",
  margin: 0
});

const SidebarCount = styled.p({
  fontSize: 11,
  color: "#666",
  margin: "4px 0 0"
});

const SiteList = styled.ul({
  listStyle: "none",
  margin: 0,
  padding: "8px 0",
  overflowY: "auto",
  flex: 1,
  scrollbarWidth: "thin",
  scrollbarColor: "#333 transparent"
});

const SiteItem = styled.li<{ active: boolean }>(({ active }) => ({
  cursor: "pointer",
  padding: "10px 16px",
  borderLeft: active ? "3px solid #e0aa3e" : "3px solid transparent",
  background: active ? "rgba(224,170,62,0.08)" : "transparent",
  transition: "background 0.15s",
  "&:hover": {
    background: active ? "rgba(224,170,62,0.12)" : "rgba(255,255,255,0.04)"
  }
}));

const SiteNameJa = styled.span<{ active: boolean }>(({ active }) => ({
  display: "block",
  fontSize: 13,
  fontWeight: active ? 700 : 400,
  color: active ? "#e0aa3e" : "#ddd",
  lineHeight: 1.4
}));

const SiteNameEn = styled.span({
  display: "block",
  fontSize: 11,
  color: "#666",
  marginTop: 2
});

const Main = styled.div({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden"
});

const PlayerArea = styled.div({
  flex: 1,
  position: "relative",
  background: "#000"
});

const IframeWrapper = styled.div({
  position: "absolute",
  inset: 0
});

const StyledIframe = styled.iframe({
  width: "100%",
  height: "100%",
  border: "none",
  display: "block"
});

const EmptyState = styled.div({
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 12
});

const EmptyIcon = styled.div({
  fontSize: 48,
  opacity: 0.3
});

const EmptyText = styled.p({
  fontSize: 14,
  color: "#555",
  margin: 0
});

const InfoBar = styled.div({
  flexShrink: 0,
  padding: "12px 24px",
  borderTop: "1px solid #1a1a1a",
  background: "#121212",
  display: "flex",
  alignItems: "baseline",
  gap: 12
});

const InfoNameJa = styled.span({
  fontSize: 18,
  fontWeight: 700,
  color: "#f0f0f0"
});

const InfoNameEn = styled.span({
  fontSize: 13,
  color: "#888"
});

const buildEmbedUrl = (site: HeritageSite) =>
  `https://www.youtube.com/embed/${VIDEO_ID}?start=${site.startSec}&autoplay=1`;

const HeritageViewerScene = () => {
  const [selected, setSelected] = useState<HeritageSite | null>(null);

  return (
    <Root>
      <Sidebar>
        <SidebarHeader>
          <SidebarTitle>世界遺産・絶景ビューア</SidebarTitle>
          <SidebarCount>{HERITAGE_SITES.length} か所</SidebarCount>
        </SidebarHeader>
        <SiteList>
          {HERITAGE_SITES.map(site => {
            const active = selected?.nameEn === site.nameEn;
            return (
              <SiteItem
                key={site.nameEn}
                active={active}
                onClick={() => setSelected(site)}
              >
                <SiteNameJa active={active}>{site.nameJa}</SiteNameJa>
                <SiteNameEn>{site.nameEn}</SiteNameEn>
              </SiteItem>
            );
          })}
        </SiteList>
      </Sidebar>
      <Main>
        <PlayerArea>
          {selected ? (
            <IframeWrapper>
              <StyledIframe
                key={selected.nameEn}
                src={buildEmbedUrl(selected)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selected.nameJa}
              />
            </IframeWrapper>
          ) : (
            <EmptyState>
              <EmptyIcon>🌍</EmptyIcon>
              <EmptyText>左のリストから場所を選んでください</EmptyText>
            </EmptyState>
          )}
        </PlayerArea>
        {selected && (
          <InfoBar>
            <InfoNameJa>{selected.nameJa}</InfoNameJa>
            <InfoNameEn>{selected.nameEn}</InfoNameEn>
          </InfoBar>
        )}
      </Main>
    </Root>
  );
};

export default HeritageViewerScene;
