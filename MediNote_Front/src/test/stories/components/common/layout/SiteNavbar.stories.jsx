import React from "react";
import SiteNavbar from "./SiteNavbar.jsx";

export default {
    title: "TEST/layout/SiteNavbar",
    component: SiteNavbar,
    parameters: {
        layout: "fullscreen",
        reactRouterPath: "/",
        reactExtraPath: [
            // 필요 시 추가 라우트
            { path: "/about", element: <div>About Page</div> },
            { path: "/docs", element: <div>Docs Page</div> },
        ],
    },
};

export const Default = () => (
    <div className="min-h-dvh bg-gray-50">
        <SiteNavbar />
        <div className="container mx-auto p-6 text-gray-700">
            네비게이션 링크 hover/active 상태를 확인해 보세요.
        </div>
    </div>
);