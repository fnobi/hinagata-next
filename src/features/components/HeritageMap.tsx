"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  OverlayViewF,
  OVERLAY_MOUSE_TARGET,
  InfoWindow
} from "@react-google-maps/api";
import styled from "@emotion/styled";
import { HERITAGE_SITES, type HeritageSite } from "~/features/schema/HeritageSite";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const CONTAINER_STYLE = { width: "100%", height: "100%" };
const DEFAULT_CENTER = { lat: 20, lng: 10 };

const NIGHT_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a9bb5" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#2d3561" }]
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }]
  },
  { featureType: "landscape", stylers: [{ color: "#0e1628" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0e2a40" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4e6d8c" }]
  }
];

const PIN_OFFSET = () => ({ x: -6, y: -6 });

const SitePin = ({
  site,
  onClick
}: {
  site: HeritageSite;
  onClick: () => void;
}) => (
  <OverlayViewF
    position={{ lat: site.lat, lng: site.lng }}
    mapPaneName={OVERLAY_MOUSE_TARGET}
    getPixelPositionOffset={PIN_OFFSET}
  >
    <div
      onClick={onClick}
      style={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: "#e0aa3e",
        border: "2px solid #111",
        cursor: "pointer",
        boxShadow: "0 1px 4px rgba(0,0,0,0.6)"
      }}
    />
  </OverlayViewF>
);

const Overlay = styled.div({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  background: "#0a0a0a",
  color: "#666",
  fontSize: 14
});

export type FocusRequest = { site: HeritageSite; id: number };

type Props = {
  focusRequest: FocusRequest | null;
  onPlayVideo: (site: HeritageSite) => void;
};

// InfoWindow内はGoogle Mapsの独自DOMに挿入されるためインラインスタイルを使う
const InfoBox = ({
  site,
  onPlay
}: {
  site: HeritageSite;
  onPlay: () => void;
}) => (
  <div style={{ padding: "2px 2px 4px", minWidth: 156 }}>
    <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 2px", color: "#111" }}>
      {site.nameJa}
    </p>
    <p style={{ fontSize: 11, color: "#777", margin: "0 0 10px" }}>
      {site.nameEn}
    </p>
    <button
      style={{
        width: "100%",
        padding: "7px 12px",
        background: "#e0aa3e",
        border: "none",
        borderRadius: 4,
        fontWeight: 700,
        fontSize: 13,
        cursor: "pointer",
        color: "#111"
      }}
      onClick={onPlay}
    >
      ▶ 動画を見る
    </button>
  </div>
);

const HeritageMap = ({ focusRequest, onPlayVideo }: Props) => {
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: API_KEY, language: "ja" });
  const mapRef = useRef<google.maps.Map | null>(null);
  const [infoSite, setInfoSite] = useState<HeritageSite | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!focusRequest || !mapRef.current) return;
    mapRef.current.panTo({ lat: focusRequest.site.lat, lng: focusRequest.site.lng });
    mapRef.current.setZoom(7);
    setInfoSite(focusRequest.site);
  }, [focusRequest]);

  if (!API_KEY) {
    return (
      <Overlay>
        <span style={{ fontSize: 36 }}>🗺️</span>
        <span>地図を表示するには</span>
        <code
          style={{
            background: "#1a1a1a",
            padding: "2px 8px",
            borderRadius: 3,
            color: "#e0aa3e",
            fontSize: 12
          }}
        >
          NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        </code>
        <span>を .env.local に設定してください</span>
      </Overlay>
    );
  }

  if (!isLoaded) {
    return <Overlay><span>地図を読み込み中...</span></Overlay>;
  }

  return (
    <GoogleMap
      mapContainerStyle={CONTAINER_STYLE}
      zoom={2}
      center={DEFAULT_CENTER}
      onLoad={onMapLoad}
      options={{
        styles: NIGHT_STYLE,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControl: true,
        minZoom: 2
      }}
    >
      {HERITAGE_SITES.map(site => (
        <SitePin key={site.nameEn} site={site} onClick={() => setInfoSite(site)} />
      ))}
      {infoSite && (
        <InfoWindow
          position={{ lat: infoSite.lat, lng: infoSite.lng }}
          onCloseClick={() => setInfoSite(null)}
        >
          <InfoBox
            site={infoSite}
            onPlay={() => {
              onPlayVideo(infoSite);
              setInfoSite(null);
            }}
          />
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default HeritageMap;
