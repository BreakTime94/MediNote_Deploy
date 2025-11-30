// src/hooks/usePlacesSearch.js
import { useState, useEffect } from "react";

export default function usePlacesSearch(map, keyword, category = "병원") {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!map || !window.kakao || !keyword) return;

        const { kakao } = window;
        const ps = new kakao.maps.services.Places();
        const center = map.getCenter();

        setLoading(true);
        ps.keywordSearch(keyword || category, (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
                setPlaces(data);
            } else {
                setPlaces([]);
            }
            setLoading(false);
        }, {
            location: center,
            radius: 3000 // 3km 반경 검색
        });

    }, [map, keyword, category]);

    return { places, loading };
}
