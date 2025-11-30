// src/router/newsRouter.jsx
import { lazy } from "react";
const NewsLayout = lazy(() => import("@/layouts/news/NewsLayout.jsx"));

const NewsNewsPanel = lazy(() => import("@/components/news/NewsNewsPanel.jsx"));
const NewsColumnsPanel = lazy(() => import("@/components/news/NewsColumnsPanel.jsx"));
const NewsHealthInfoPanel = lazy(() => import("@/components/news/NewsHealthInfoPanel.jsx"));

/**
 * 뉴스 도메인 라우터 (레이아웃 + 자식 라우트)
 */
const newsRouter = [
    {
        element: <NewsLayout />,   // ← AsideNav는 여기에서 한 번만 렌더
        children: [
            { path: "/news",        element: <NewsNewsPanel /> },
            { path: "/columns",     element: <NewsColumnsPanel /> },
            { path: "/health-info", element: <NewsHealthInfoPanel /> },
        ],
    },
];

export default newsRouter;
