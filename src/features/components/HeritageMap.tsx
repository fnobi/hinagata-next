"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
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

// google.maps.SymbolPath.CIRCLE = 0
const MARKER_ICON: google.maps.Symbol = {
  path: 0 as google.maps.SymbolPath,
  fillColor: "#e0aa3e",
  fillOpacity: 1,
  strokeColor: "#111",
  strokeWeight: 1.5,
  scale: 6
};

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
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: API_KEY });
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
        <Marker
          key={site.nameEn}
          position={{ lat: site.lat, lng: site.lng }}
          icon={MARKER_ICON}
          onClick={() => setInfoSite(site)}
        />
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
