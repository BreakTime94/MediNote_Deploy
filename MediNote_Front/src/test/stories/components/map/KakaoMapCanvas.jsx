// src/components/map/KakaoMapCanvas.jsx
import React, { useEffect, useRef, useState } from "react";
import useKakaoLoader from "./useKakaoLoader";

/**
 * KakaoMapCanvas
 * - Storybook에서 바로 지도를 띄우기 위한 최소 단위 컴포넌트
 * - REST 호출 없이, 전달받은 places(샘플)로 마커만 렌더링
 *
 * props
 * - jsKey?: string                         // (선택) 스토리북에서 직접 키 주입 시 사용, 기본은 VITE_KAKAO_JS_KEY
 * - center?: { lat: number, lng: number }  // 지도 중심 (기본: 서울시청)
 * - level?: number                         // 확대 레벨 (작을수록 확대, 기본: 4)
 * - height?: string                        // 지도 높이 (기본: "480px")
 * - showMyLocation?: boolean               // 내 위치 마커 표시 (기본: true)
 * - places?: { name: string, lat: number, lng: number }[] // 샘플 마커 목록
 * - onReady?: (map: kakao.maps.Map) => void // 지도 인스턴스 필요 시 콜백
 */
export default function KakaoMapCanvas({
                                           jsKey,
                                           center = { lat: 37.5665, lng: 126.9780 }, // 서울시청
                                           level = 4,
                                           height = "480px",
                                           showMyLocation = true,
                                           places = [],
                                           onReady,
                                       }) {
    const { ready, error } = useKakaoLoader(jsKey);
    const mapRef = useRef(null);
    const containerRef = useRef(null);
    const [myPos, setMyPos] = useState(null);
    const markersRef = useRef([]);

    // 현재 위치 수집 (동의 시)
    useEffect(() => {
        if (!showMyLocation || !navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setMyPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            () => {
                // 동의 안 하거나 실패해도 무시 (기본 center 사용)
            }
        );
    }, [showMyLocation]);

    // 지도 초기화
    useEffect(() => {
        if (!ready || error) return;
        if (!containerRef.current) return;

        const kakao = window.kakao;
        const centerLatLng = new kakao.maps.LatLng(
            myPos?.lat ?? center.lat,
            myPos?.lng ?? center.lng
        );
        const map = new kakao.maps.Map(containerRef.current, {
            center: centerLatLng,
            level,
        });
        mapRef.current = map;
        if (typeof onReady === "function") onReady(map);

        // 내 위치 마커
        let myMarker;
        if (showMyLocation && myPos) {
            myMarker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(myPos.lat, myPos.lng),
                map,
            });
        }

        // 샘플 마커 렌더링
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];
        const bounds = new kakao.maps.LatLngBounds();
        bounds.extend(centerLatLng);

        places.forEach((p) => {
            const marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(p.lat, p.lng),
                map,
            });
            markersRef.current.push(marker);

            const iw = new kakao.maps.InfoWindow({
                content: `<div style="padding:6px 10px;white-space:nowrap;">${p.name}</div>`,
            });
            kakao.maps.event.addListener(marker, "click", () => iw.open(map, marker));

            bounds.extend(new kakao.maps.LatLng(p.lat, p.lng));
        });

        // 플레이스가 있으면 보기 좋게 영역 맞춤
        if (places.length > 0) {
            map.setBounds(bounds);
        }

        // cleanup
        return () => {
            markersRef.current.forEach((m) => m.setMap(null));
            markersRef.current = [];
            if (myMarker) myMarker.setMap(null);
            mapRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, error, center.lat, center.lng, level, JSON.stringify(places), myPos, showMyLocation]);

    if (error) {
        return (
            <div className="p-4 rounded border border-red-200 text-red-600 bg-red-50">
                {error}
            </div>
        );
    }
    if (!ready) {
        return (
            <div className="p-4 rounded border bg-gray-50 text-gray-600">
                Kakao SDK 로딩 중...
            </div>
        );
    }

    return (
        <div className="w-full">
            <div
                ref={containerRef}
                className="w-full rounded shadow"
                style={{ height }}
                aria-label="Kakao Map"
            />
        </div>
    );
}
