// src/pages/map/MapPage.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import KakaoMap from "../../components/map/KakaoMap";
import MapHeader from "../../components/map/MapHeader";
import PlaceList from "../../components/map/PlaceList";

const DEFAULT_CENTER = { lat: 37.485899, lng: 126.897450 };
const DEFAULT_LEVEL = 5;
const IP_GEO_URL = import.meta.env.VITE_IP_GEO_URL; // 선택(없어도 작동)

export default function MapPage() {
    const [map, setMap] = useState(null);
    const [kakao, setKakao] = useState(null);
    const [places, setPlaces] = useState([]);
    const [keyword, setKeyword] = useState("병원");     // 검색어
    const [category, setCategory] = useState("병원");   // "병원" | "약국"
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [dirty, setDirty] = useState(false);          // 지도 이동됨 플래그

    const markersRef = useRef([]);
    const myCircleRef = useRef(null);                   // ✅ 내 위치 원형 표시
    const latestBoundsRef = useRef(null);

    // ===== 지도 준비 =====
    const handleMapReady = useCallback((kakaoObj, mapObj) => {
        setKakao(kakaoObj);
        setMap(mapObj);

        // 첫 레이아웃 계산 (깜빡임 방지)
        setTimeout(() => mapObj.relayout(), 0);

        // 시작 중심/레벨 고정
        const center = new kakaoObj.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
        mapObj.setCenter(center);
        mapObj.setLevel(DEFAULT_LEVEL);
    }, []);

    const handleMapClick = useCallback(() => setSelected(null), []);

    // 지도 이동/줌 종료 후 현재 영역 저장 → 재검색 버튼 노출
    const handleIdle = useCallback(({ bounds }) => {
        latestBoundsRef.current = bounds;
        setDirty(true);
    }, []);

    // 윈도우 리사이즈 → relayout 디바운스
    useEffect(() => {
        if (!map) return;
        let t;
        const onResize = () => {
            clearTimeout(t);
            t = setTimeout(() => map.relayout(), 200);
        };
        window.addEventListener("resize", onResize);
        return () => {
            clearTimeout(t);
            window.removeEventListener("resize", onResize);
        };
    }, [map]);

    // ===== 유틸: 텍스트로 중심 좌표 찾기 (Places → Geocoder 폴백) =====
    const findCenterByQuery = useCallback(
        (q) =>
            new Promise((resolve, reject) => {
                if (!kakao) return reject(new Error("Kakao not ready"));
                const { maps } = kakao;
                const ps = new maps.services.Places();

                // 1) 지명/POI 우선
                ps.keywordSearch(q, (data, status) => {
                    if (status === maps.services.Status.OK && data.length) {
                        const { x, y } = data[0];
                        return resolve({ lat: parseFloat(y), lng: parseFloat(x), name: data[0].place_name });
                    }
                    // 2) 주소 폴백
                    const geocoder = new maps.services.Geocoder();
                    geocoder.addressSearch(q, (res, s) => {
                        if (s === maps.services.Status.OK && res.length) {
                            const { x, y } = res[0];
                            return resolve({ lat: parseFloat(y), lng: parseFloat(x), name: res[0].address_name });
                        }
                        reject(new Error("검색 결과 없음"));
                    });
                });
            }),
        [kakao]
    );

    // ===== 유틸: 내 위치 원형 표시 =====
    const showMyLocationCircle = useCallback(
        (lat, lng) => {
            if (!map || !kakao) return;
            const center = new kakao.maps.LatLng(lat, lng);

            if (myCircleRef.current) {
                myCircleRef.current.setOptions({ center });
                myCircleRef.current.setMap(map);
            } else {
                myCircleRef.current = new kakao.maps.Circle({
                    center,
                    radius: 20,               // 약 20m
                    strokeWeight: 3,
                    strokeColor: "#3b82f6",   // tailwind blue-500
                    strokeOpacity: 0.9,
                    strokeStyle: "solid",
                    fillColor: "#3b82f6",
                    fillOpacity: 0.3,
                    zIndex: 1000,
                });
                myCircleRef.current.setMap(map);
            }
        },
        [map, kakao]
    );

    // (옵션) IP 기반 대략 위치
    const fetchIpGeo = useCallback(async () => {
        if (!IP_GEO_URL) return null;
        try {
            const res = await fetch(IP_GEO_URL, { cache: "no-store" });
            const j = await res.json();
            const lat = Number(j.latitude || j.lat);
            const lng = Number(j.longitude || j.lon || j.lng);
            if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
            return null;
        } catch {
            return null;
        }
    }, []);

    // ===== 공통 검색 =====
    const runSearch = useCallback(
        ({ useMapBounds = false, centerOverride = null } = {}) => {
            if (!map || !kakao) return;

            setLoading(true);
            const ps = new kakao.maps.services.Places(map);

            // 옵션 결정
            let options;
            if (useMapBounds) {
                options = { useMapBounds: true, bounds: map.getBounds() };
            } else if (centerOverride) {
                options = {
                    location: new kakao.maps.LatLng(centerOverride.lat, centerOverride.lng),
                    radius: 3000,
                };
            } else {
                options = { location: map.getCenter(), radius: 3000 };
            }

            // 빈 검색어면 카테고리 사용
            const q = (keyword && keyword.trim()) || category;

            ps.keywordSearch(
                q,
                (data, status) => {
                    setLoading(false);

                    // 기존 마커 정리
                    markersRef.current.forEach((m) => m.setMap(null));
                    markersRef.current = [];

                    if (status !== kakao.maps.services.Status.OK) {
                        setPlaces([]);
                        return;
                    }

                    const bounds = new kakao.maps.LatLngBounds();
                    data.forEach((p) => {
                        const pos = new kakao.maps.LatLng(p.y, p.x);
                        const marker = new kakao.maps.Marker({ map, position: pos });
                        markersRef.current.push(marker);
                        bounds.extend(pos);
                    });

                    // 영역 검색이 아닐 때만 결과에 맞게 이동
                    if (!useMapBounds) {
                        if (centerOverride) {
                            // 중심만 이동(줌 유지)
                            map.setCenter(new kakao.maps.LatLng(centerOverride.lat, centerOverride.lng));
                        } else {
                            // 현재 뷰와 유사하면 setBounds 생략(깜빡임 감소)
                            const current = map.getBounds();
                            if (
                                !current ||
                                !current.contain(bounds.getSouthWest()) ||
                                !current.contain(bounds.getNorthEast())
                            ) {
                                map.setBounds(bounds);
                            }
                        }
                    }

                    setPlaces(data);
                    setDirty(false);
                },
                options
            );
        },
        [map, kakao, keyword, category]
    );

    // 초기/키워드 변경 시 검색
    useEffect(() => {
        runSearch({ useMapBounds: false });
    }, [runSearch, keyword]);

    // ===== 리스트 선택 → 지도 이동 =====
    const handleSelect = (place) => {
        if (!map || !kakao) return;
        const moveLatLon = new kakao.maps.LatLng(place.y, place.x);
        map.panTo(moveLatLon);
        setSelected(place);
    };

    // ===== 헤더 액션 =====
    // 검색: 입력 위치로 이동 → 주변 검색
    const handleSearchSubmit = async (q) => {
        const query = q?.trim();
        if (!query) return setKeyword(category);
        try {
            const center = await findCenterByQuery(query);
            map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
            map.setLevel(5);
            runSearch({ useMapBounds: false, centerOverride: center });
        } catch (e) {
            console.warn("검색 실패:", e.message);
        }
    };

    // 내 위치: 성공 → 원형 표시 / 실패 → IP 또는 현재 뷰 폴백
    const handleLocate = () => {
        if (!map || !kakao) return;

        const applyPosition = (lat, lng, level = 5) => {
            const pos = new kakao.maps.LatLng(lat, lng);
            map.setCenter(pos);
            map.setLevel(level);
            showMyLocationCircle(lat, lng); // ✅ 내 위치 원형 표시
            runSearch({ useMapBounds: false, centerOverride: { lat, lng } });
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    applyPosition(coords.latitude, coords.longitude, 5);
                },
                async () => {
                    const ipPos = await fetchIpGeo();
                    if (ipPos) applyPosition(ipPos.lat, ipPos.lng, 7);
                    else {
                        const c = map.getCenter();
                        applyPosition(c.getLat(), c.getLng(), map.getLevel());
                    }
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            (async () => {
                const ipPos = await fetchIpGeo();
                if (ipPos) applyPosition(ipPos.lat, ipPos.lng, 7);
                else {
                    const c = map.getCenter();
                    applyPosition(c.getLat(), c.getLng(), map.getLevel());
                }
            })();
        }
    };

    // 초기화: 기본 중심/레벨 복귀 + 내 위치 원 숨김
    const handleReset = () => {
        if (!map || !kakao) return;
        map.setCenter(new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng));
        map.setLevel(DEFAULT_LEVEL);
        setKeyword(category);
        if (myCircleRef.current) myCircleRef.current.setMap(null); // ✅ 숨김
        runSearch({ useMapBounds: false, centerOverride: DEFAULT_CENTER });
    };

    const handleTogglePharmacy = () => {
        setCategory("약국");
        setKeyword("약국");
    };
    const handleToggleHospital = () => {
        setCategory("병원");
        setKeyword("병원");
    };

    return (
        <div className="w-full bg-gray-50 px-6 py-6 min-h-[calc(100vh-140px)]">
            <div className="max-w-7xl mx-auto space-y-4">
                <MapHeader
                    title="내 주변 병원 · 약국 찾기"
                    onSearch={handleSearchSubmit}
                    onLocate={handleLocate}
                    onReset={handleReset}
                    onTogglePharmacy={handleTogglePharmacy}
                    onToggleHospital={handleToggleHospital}
                />

                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_380px] gap-4">
                    {/* 지도 래퍼: 둥근 모서리/쉐도우는 여기만 */}
                    <div className="relative rounded-xl shadow">
                        {/* 실제 지도 컨테이너는 네모(overflow-hidden 제거) */}
                        <div className="w-full h-[600px] relative">
                            {dirty && (
                                <button
                                    onClick={() => runSearch({ useMapBounds: true })}
                                    className="absolute z-[100] top-3 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 text-sm shadow border hover:bg-white"
                                >
                                    이 지역에서 재검색
                                </button>
                            )}

                            <KakaoMap
                                onReady={handleMapReady}
                                onClick={handleMapClick}
                                onIdle={handleIdle}
                                center={DEFAULT_CENTER}
                                level={DEFAULT_LEVEL}
                                marker={false}
                                infoWindowContent=""
                                className="absolute inset-0" // 부모가 h-[600px]을 가지고 있어 전체 채움
                            />
                        </div>
                    </div>

                    {/* 리스트 패널 */}
                    <aside className="rounded-xl bg-white shadow h-[600px] flex flex-col">
                        {loading ? (
                            <p className="text-center text-gray-500 py-6">검색 중...</p>
                        ) : (
                            <PlaceList
                                places={places}
                                onSelect={handleSelect}
                                className="flex-1 overflow-y-auto"
                            />
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}
