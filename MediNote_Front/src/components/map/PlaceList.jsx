// src/components/map/PlaceList.jsx
import React from "react";

export default function PlaceList({ places = [], onSelect, className = "" }) {
    if (!places.length) {
        return (
            <div className={`text-center text-gray-400 py-8 ${className}`}>
                주변에 검색된 장소가 없습니다.
            </div>
        );
    }

    return (
        // ✅ 스타일은 부모가 맡고, 이 컨테이너는 크기/스크롤만 담당
        <div className={`p-4 space-y-3 ${className}`}>
            {places.map((p, i) => (
                <div
                    key={i}
                    onClick={() => onSelect(p)}
                    className="p-3 border-b cursor-pointer hover:bg-gray-50"
                >
                    <h3 className="font-semibold text-gray-800">{p.place_name}</h3>
                    <p className="text-sm text-gray-600">{p.road_address_name}</p>
                    <p className="text-sm text-gray-500">{p.phone || "전화번호 없음"}</p>
                </div>
            ))}
        </div>
    );
}
