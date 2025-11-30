import { lazy } from "react";

// Lazy load
const QnAPage = lazy(() => import("@/pages/qna/QnAPage.jsx"));
const FaqPage = lazy(() => import("@/pages/faq/FaqPage.jsx"));
const NotifyPage = lazy(() => import("@/pages/notify/NotifyPage.jsx"));
const QnAReadPage = lazy(() => import("@/components/qna/QnAReadPanel.jsx"));
const QnAWritePage = lazy(() => import("@/components/qna/QnAWritePanel.jsx"));
const NotifyReadPage = lazy(() => import("@/components/notify/NotifyReadPanel.jsx"));
const NotifyWritePage = lazy(() => import("@/components/notify/NotifyWritePanel.jsx"));

const FaqReadPage = lazy(() => import("@/components/faq/FaQReadPanel.jsx"));
const FaqWritePage = lazy(() => import("@/components/faq/FaQWritePanel.jsx"));
/**
 * 게시판(boards) 라우터
 * - /boards/qna : QnA 리스트
 * - /boards/faq : FAQ 리스트
 * - 추후 /boards/notice 등 확장 가능
 */
const BoardRouter = [
    {
        path: "/boards",
        children: [
            // Boards 홈(임시)
            { index: true, element: <div>Boards Home</div> },

            // QnA 리스트
            { path: "qna", element: <QnAPage /> },
            { path: "qna/read/:id", element: <QnAReadPage /> },
            { path: "qna/write", element: <QnAWritePage /> },

            // ✅ FAQ 리스트
            { path: "faq", element: <FaqPage /> },
            { path: "faq/read/:id", element: <FaqReadPage /> },     // ✅ 추가
            { path: "faq/write", element: <FaqWritePage /> },

            { path: "notice", element: <NotifyPage /> },
            { path: "notice/read/:id", element: <NotifyReadPage /> },
            { path: "notice/write", element: <NotifyWritePage /> },

            // 추후 추가 예정
            // { path: "qna/read/:id", element: <QnAReadPage /> },
            // { path: "qna/write", element: <QnAWritePage /> },
        ],
    },
];

export default BoardRouter;
