import React from "react";
import TestToastPage from "./TestToastPage.jsx";

export default {
    title: "Test/ui/main",
    component: TestToastPage,
    parameters: {
        reactRouterPath: "/ui/toast",
        reactExtraPath: [
            // 필요 시 추가 경로를 여기에 계속 넣으면 됨
            // { path: "/ui/toast", element: <TestToastPage /> },
        ],
        layout: "centered",
    },
};

export const Toast = () => <TestToastPage />;