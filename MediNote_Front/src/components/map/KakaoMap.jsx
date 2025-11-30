import React, { useEffect, useRef, useState } from "react";

const KAKAO_KEY = import.meta.env.VITE_KAKAO_JS_KEY;

export default function KakaoMap({
                                     center = { lat: 37.5665, lng: 126.9780 },
                                     level = 3,
                                     draggable = true,
                                     scrollwheel = true,
                                     marker = true,
                                     infoWindowContent = "서울시청 (기본 예제)",
                                     className = "w-full h-full",
                                     onReady,
                                     onClick,
                                     onIdle,
                                 }) {
    const containerRef = useRef(null);
    const [kakaoMap, setKakaoMap] = useState(null);
    const [error, setError] = useState(null);

    // 1. 지도 SDK 로드 및 지도 생성 (기존 코드와 동일)
    useEffect(() => {
        if (window.kakao && window.kakao.maps) {
            loadMap();
            return;
        }

        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false&libraries=services`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                loadMap();
            });
        };

        script.onerror = () => {
            setError("Kakao SDK를 불러오는 데 실패했습니다.");
        };

        function loadMap() {
            if (!containerRef.current) return;
            const kakao = window.kakao;
            const centerLatLng = new kakao.maps.LatLng(center.lat, center.lng);
            const mapOptions = { center: centerLatLng, level, draggable, scrollwheel };
            const map = new kakao.maps.Map(containerRef.current, mapOptions);
            setKakaoMap(map);

            if (typeof onReady === "function") {
                onReady(kakao, map);
            }
        }
    }, []); // 최초 1회만 실행

    // 2. 지도 옵션 변경 및 마커/인포윈도우/클릭 이벤트 처리 (기존 코드와 거의 동일)
    useEffect(() => {
        if (!kakaoMap) return;

        const kakao = window.kakao;
        const centerLatLng = new kakao.maps.LatLng(center.lat, center.lng);

        kakaoMap.setCenter(centerLatLng);
        kakaoMap.setLevel(level);

        if (marker) {
            const mk = new kakao.maps.Marker({ position: centerLatLng, map: kakaoMap });
            if (infoWindowContent) {
                const info = new kakao.maps.InfoWindow({
                    position: centerLatLng,
                    content: `<div style="padding:8px 12px;font-size:13px;">${infoWindowContent}</div>`,
                });
                info.open(kakaoMap, mk);
            }
        }

        const clickHandler = (mouseEvent) => {
            const latlng = mouseEvent.latLng;
            if (typeof onClick === "function") {
                onClick(latlng.getLat(), latlng.getLng(), kakao, kakaoMap);
            }
        };
        kakao.maps.event.addListener(kakaoMap, "click", clickHandler);

        return () => {
            kakao.maps.event.removeListener(kakaoMap, "click", clickHandler);
        };
    }, [kakaoMap, center.lat, center.lng, level, marker, infoWindowContent, onClick]);


    // ✨ 추가된 부분: 확대/축소 컨트롤을 지도에 추가하고 제거합니다.
    useEffect(() => {
        if (!kakaoMap) return; // kakaoMap 인스턴스가 없으면 아무것도 하지 않음

        const kakao = window.kakao;

        // 줌 컨트롤 생성
        const zoomControl = new kakao.maps.ZoomControl();

        // 지도 오른쪽에 줌 컨트롤 추가
        kakaoMap.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        // 컴포넌트가 언마운트될 때 컨트롤을 제거하기 위한 클린업 함수
        return () => {
            kakaoMap.removeControl(zoomControl);
        };
    }, [kakaoMap]); // 이 useEffect는 kakaoMap 인스턴스가 생성되거나 변경될 때만 실행

    useEffect(() => {
        if (!kakaoMap) return;
        const kakao = window.kakao;

        // idle: 드래그/줌 등 상호작용 종료 후 발생
        const idleHandler = () => {
            if (typeof onIdle === "function") {
                onIdle({
                    center: kakaoMap.getCenter(),
                    bounds: kakaoMap.getBounds(),
                    level: kakaoMap.getLevel(),
                });
            }
        };

        kakao.maps.event.addListener(kakaoMap, "idle", idleHandler);

        return () => {
            kakao.maps.event.removeListener(kakaoMap, "idle", idleHandler);
        };
    }, [kakaoMap, onIdle]);


    return (
        <div className={className} style={{ minHeight: "500px", width: "100%" }}>
            <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
            {error && (
                <div className="absolute bottom-2 left-2 rounded-md bg-red-50 text-red-700 text-sm px-3 py-2 shadow">
                    SDK 로드 실패: {error}
                </div>
            )}
        </div>
    );
}