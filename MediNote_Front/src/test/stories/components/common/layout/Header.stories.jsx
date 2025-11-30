import React from "react";
import Header from "./Header.jsx"

export default {
    title: "TEST/layout/Header",
    component: Header,
    parameters: {
        layout: "fullscreen",
        reactRouterPath: "/",
        reactExtraPath: [],
    },
};

export const Default = () => (
    <div className="min-h-dvh bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto p-6 text-gray-600">
            본문 영역(더미). 버튼 클릭 시 alert 동작 확인 가능.
        </div>
    </div>
);