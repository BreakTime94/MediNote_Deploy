// src/components/map/MapContainer.stories.jsx
import React from "react";
import MapContainer from "./MapContainer";

export default {
    title: "Test/Common/MapContainer",
    component: MapContainer,
    parameters: {
        // 스토리 캔버스를 좀 더 넓게 쓰고 싶다면
        layout: "fullscreen",
        // docs 등 추가 설정 가능
    },
    argTypes: {
        lat: { control: { type: "number" } },
        lng: { control: { type: "number" } },
        level: { control: { type: "number", min: 1, max: 14, step: 1 } },
        width: { control: "text" },
        height: { control: "text" },
    },
};

/**
 * NOTE
 * - Kakao SDK는 .storybook/preview-head.html에서 전역 로드됨
 *   <script defer src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=..."></script>
 * - 따라서 여기서는 appKey/loader 관련 설정 불필요
 */

const Template = (args) => <MapContainer {...args} />;

// ✅ 기본 지도 (MapContainer의 기본값: 예를 들어 서울 시청 등)
export const DefaultMap = Template.bind({});
DefaultMap.args = {
    // MapContainer 내부 defaultProps를 그대로 사용
};

// ✅ 특정 위치/크기 커스텀 (부산 예시)
export const CustomLocationMap = Template.bind({});
CustomLocationMap.args = {
    lat: 35.1796,
    lng: 129.0756,
    level: 4,
    width: "100%",
    height: "500px",
};

// ✅ 또 다른 예시: 대전 + 확대 레벨
export const DaejeonZoomed = Template.bind({});
DaejeonZoomed.args = {
    lat: 36.3504,
    lng: 127.3845,
    level: 6,
    width: "800px",
    height: "600px",
};
