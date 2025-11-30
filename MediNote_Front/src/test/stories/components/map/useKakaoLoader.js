// src/components/map/useKakaoLoader.js
import { useEffect, useState } from "react";

/**
 * Kakao Maps SDK 안정 로더
 * - autoload=false 로 로드 후 kakao.maps.load 콜백에서 ready 처리
 * - 기존 실패/오류 스크립트가 남아있는 경우 제거 후 재로딩
 * - 우선순위: props.jsKey > import.meta.env.VITE_KAKAO_JS_KEY
 */
export default function useKakaoLoader(jsKey) {
    const [ready, setReady] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const key = jsKey || import.meta.env?.VITE_KAKAO_JS_KEY;
        if (!key) {
            setError("Kakao JavaScript Key가 없습니다. (.env VITE_KAKAO_JS_KEY 또는 props.jsKey)");
            return;
        }

        // 이미 준비됨
        if (window.kakao?.maps && typeof window.kakao.maps.load === "function") {
            window.kakao.maps.load(() => setReady(true));
            return;
        }

        // 이전 실패 스크립트 정리
        const existed = document.getElementById("kakao-maps-sdk");
        if (existed) existed.remove();

        const script = document.createElement("script");
        script.id = "kakao-maps-sdk";
        script.async = true;
        script.src =
            `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}` +
            `&libraries=services` +
            `&autoload=false`;

        script.onload = () => {
            if (!window.kakao?.maps?.load) {
                setError("Kakao SDK가 로드되었지만 maps.load가 없습니다.");
                return;
            }
            // SDK 내부가 모두 초기화된 뒤에 ready=true
            window.kakao.maps.load(() => setReady(true));
        };

        script.onerror = () => {
            setError("Kakao SDK 네트워크 로드 실패 (키/도메인/네트워크 확인)");
        };

        document.head.appendChild(script);
    }, [jsKey]);

    return { ready, error };
}
