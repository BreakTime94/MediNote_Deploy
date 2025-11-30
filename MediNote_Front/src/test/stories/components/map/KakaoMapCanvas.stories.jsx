// src/test/stories/components/map/KakaoMapCanvas.stories.jsx
import React from "react";
import KakaoMapCanvas from "./KakaoMapCanvas.jsx";

/**
 * Storybook에서 실행 전 체크리스트
 * 1) Kakao Developers > 내 애플리케이션 > 플랫폼(웹) 에
 *    http://localhost:6006 도메인을 등록하세요.
 * 2) 루트 .env 파일에 VITE_KAKAO_JS_KEY=카카오_자바스크립트_키 값을 넣으세요.
 *    (또는 각 스토리의 args.jsKey 로 직접 전달해도 됩니다)
 */

export default {
    title: "Map/KakaoMapCanvas",
    component: KakaoMapCanvas,
    parameters: {
        layout: "fullscreen",
    },
};



const Template = (args) => <KakaoMapCanvas {...args} />;

export const BasicSeoul = Template.bind({});
BasicSeoul.args = {
    jsKey: "{key}",
    center: { lat: 37.5665, lng: 126.9780 }, // 서울시청
    level: 4,
    height: "520px",
    showMyLocation: false,
    places: [
        { name: "샘플 약국 A", lat: 37.56695, lng: 126.97830 },
        { name: "샘플 병원 B", lat: 37.56590, lng: 126.97750 },
    ],
};

export const WithMyLocation = Template.bind({});
WithMyLocation.args = {
    center: { lat: 37.5665, lng: 126.9780 },
    level: 5,
    height: "520px",
    showMyLocation: true,
    places: [],
};

export const DenseMarkers = Template.bind({});
DenseMarkers.args = {
    center: { lat: 37.498, lng: 127.027 }, // 강남역 일대
    level: 6,
    height: "520px",
    showMyLocation: false,
    places: [
        { name: "샘플 약국 1", lat: 37.4985, lng: 127.0270 },
        { name: "샘플 병원 2", lat: 37.4982, lng: 127.0280 },
        { name: "샘플 약국 3", lat: 37.4978, lng: 127.0265 },
        { name: "샘플 병원 4", lat: 37.4974, lng: 127.0278 },
    ],
};
