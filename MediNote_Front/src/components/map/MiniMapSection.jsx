import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KakaoMap from "@/components/map/KakaoMap.jsx";
import { Button } from "@/components/common/button/Button.jsx";
import { MapPin, RefreshCw, BookOpen } from "lucide-react";

export default function MiniMapSection() {
    const navigate = useNavigate();
    const [category, setCategory] = useState("약국"); // 기본값: 약국
    const [map, setMap] = useState(null);
    const [kakaoObj, setKakaoObj] = useState(null);
    const [userPos, setUserPos] = useState(null);

    const DEFAULT_CENTER = { lat: 37.485899, lng: 126.89745 };
    const DEFAULT_LEVEL = 5;

    /** ✅ 지도 준비 */
    const handleMapReady = useCallback((kakao, map) => {
        setKakaoObj(kakao);
        setMap(map);

        // 최초 중심 (기본 or 사용자 위치)
        if (userPos) {
            const pos = new kakao.maps.LatLng(userPos.lat, userPos.lng);
            map.setCenter(pos);
            map.setLevel(DEFAULT_LEVEL);
        } else {
            const center = new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
            map.setCenter(center);
            map.setLevel(DEFAULT_LEVEL);
        }
    }, [userPos]);

    /** ✅ 현재 위치 가져오기 */
    const fetchUserLocation = useCallback(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setUserPos({ lat: latitude, lng: longitude });
            },
            () => {
                console.warn("위치 정보를 가져올 수 없습니다. 기본 위치로 대체합니다.");
                setUserPos(DEFAULT_CENTER);
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    }, []);

    /** ✅ 카테고리별 주변 검색 */
    const searchNearbyPlaces = useCallback(() => {
        if (!map || !kakaoObj) return;

        const { maps } = kakaoObj;
        const ps = new maps.services.Places();

        // 중심 좌표
        const center = userPos
            ? new maps.LatLng(userPos.lat, userPos.lng)
            : map.getCenter();

        // 지도 초기화 (기존 마커 제거)
        map.setLevel(4);
        map.relayout();

        // 기존 마커 클리어
        if (window._previewMarkers) {
            window._previewMarkers.forEach((m) => m.setMap(null));
        }
        window._previewMarkers = [];

        // 검색 실행
        ps.keywordSearch(
            category,
            (data, status) => {
                if (status !== maps.services.Status.OK) return;

                const bounds = new maps.LatLngBounds();
                data.slice(0, 5).forEach((p) => {
                    const pos = new maps.LatLng(p.y, p.x);
                    const marker = new maps.Marker({ position: pos, map });
                    const iw = new maps.InfoWindow({
                        content: `<div style="padding:6px 10px;font-size:13px;">${p.place_name}</div>`,
                    });
                    kakaoObj.maps.event.addListener(marker, "click", () => {
                        iw.open(map, marker);
                    });
                    bounds.extend(pos);
                    window._previewMarkers.push(marker);
                });
                map.setBounds(bounds);
            },
            { location: center, radius: 3000 }
        );

        // 내 위치 원 표시
        if (userPos) {
            const circle = new maps.Circle({
                center: new maps.LatLng(userPos.lat, userPos.lng),
                radius: 30,
                strokeWeight: 2,
                strokeColor: "#3b82f6",
                strokeOpacity: 0.9,
                fillColor: "#3b82f6",
                fillOpacity: 0.3,
                map,
                zIndex: 999,
            });
            window._previewMarkers.push(circle);
        }
    }, [map, kakaoObj, category, userPos]);

    /** ✅ 초기 로딩 시 */
    useEffect(() => {
        fetchUserLocation();
    }, []);

    /** ✅ 위치 정보나 카테고리 변경 시 재검색 */
    useEffect(() => {
        if (map && kakaoObj) searchNearbyPlaces();
    }, [category, userPos, map, kakaoObj]);

    return (
        <div className="map-section bg-white border-2 border-gray-200 p-6 rounded-lg shadow-sm">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen size={20} className="text-pink-500" />
                    내 주변 {category}
                </h2>
                <div className="flex gap-2">
                    <Button
                        variant={category === "병원" ? "gradient" : "white"}
                        size="sm"
                        radius="md"
                        className={category === "병원" ? "!text-white !bg-gradient-to-r !from-[#ff9bd4] !to-[#c89cff]" : ""}
                        onClick={() => setCategory("병원")}
                    >
                        병원
                    </Button>

                    <Button
                        variant={category === "약국" ? "gradient" : "white"}
                        size="sm"
                        radius="md"
                        className={category === "약국" ? "!text-white !bg-gradient-to-r !from-[#ff9bd4] !to-[#c89cff]" : ""}
                        onClick={() => setCategory("약국")}
                    >
                        약국
                    </Button>
                    <Button
                        variant="white"
                        size="sm"
                        radius="md"
                        leftIcon={<RefreshCw size={16} />}
                        onClick={() => navigate("/map")}
                    >
                        자세히 보기
                    </Button>
                </div>
            </div>

            {/* 지도 */}
            <div className="relative w-full h-[300px] rounded-lg overflow-hidden ">
                <KakaoMap
                    onReady={handleMapReady}
                    center={userPos || DEFAULT_CENTER}
                    level={DEFAULT_LEVEL}
                    marker={false}
                    className="absolute inset-0"
                />
                {!userPos && (
                    <div className="absolute bottom-2 left-2 bg-white/80 text-sm text-gray-600 px-3 py-1 rounded-md shadow">
                        📍 위치정보 수집 중...
                    </div>
                )}
            </div>
        </div>
    );
}
