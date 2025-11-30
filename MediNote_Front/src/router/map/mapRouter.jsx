import { lazy } from "react";

// Lazy load
const MapPage = lazy(() => import("@/pages/map/MapPage.jsx"));

/**
 * 지도 관련 라우터
 * /map 경로 아래에서 지도 페이지를 관리합니다.
 */
const mapRouter = [
    {
        path: "/map",
        element: <MapPage />,
    },
];

export default mapRouter;
