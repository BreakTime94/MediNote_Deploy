import React, { useState } from "react";
import { Button } from "../common/button/Button.jsx"; // 경로는 실제 구조에 맞게 수정하세요
import { Locate, RefreshCw, MapPin } from "lucide-react"; // lucide-react 아이콘

/**
 * MapHeader - 지도 페이지 상단 영역
 * 제목 + 검색창 + 지도 제어 버튼들
 */
export default function MapHeader({
                                      title = "내 주변 병원 · 약국 찾기",
                                      onSearch,
                                      onLocate, // 현재 위치 이동
                                      onReset, // 지도 초기화
                                      onTogglePharmacy, // 약국만 보기
                                      onToggleHospital, // 병원만 보기
                                  }) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) onSearch(query);
    };

    return (
        <div className="flex items-center justify-between px-6 py-3 border-b bg-white shadow-sm">
            {/* ===== 제목 ===== */}
            <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

            {/* ===== 오른쪽 영역 (검색 + 버튼) ===== */}
            <div className="flex items-center gap-3">
                {/* 검색 입력 */}
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="지역 또는 장소를 입력하세요..."
                        className="px-3 py-2 border rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                    <Button variant="white" size="sm" radius="md" type="submit">
                        검색
                    </Button>
                </form>

                {/* 지도 제어 버튼들 */}
                <div className="flex items-center gap-2 ml-3">
                    <Button
                        variant="white"
                        size="sm"
                        radius="md"
                        leftIcon={<Locate size={16} />}
                        onClick={onLocate}
                    >
                        내 위치
                    </Button>

                    <Button
                        variant="white"
                        size="sm"
                        radius="md"
                        leftIcon={<RefreshCw size={16} />}
                        onClick={onReset}
                    >
                        초기화
                    </Button>

                    <Button
                        variant="white"
                        size="sm"
                        radius="md"
                        leftIcon={<MapPin size={16} />}
                        onClick={onTogglePharmacy}
                    >
                        약국
                    </Button>

                    <Button
                        variant="white"
                        size="sm"
                        radius="md"
                        leftIcon={<MapPin size={16} />}
                        onClick={onToggleHospital}
                    >
                        병원
                    </Button>
                </div>
            </div>
        </div>
    );
}
