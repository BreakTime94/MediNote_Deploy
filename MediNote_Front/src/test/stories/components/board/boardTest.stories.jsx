import React from "react";

// 진입 버튼 모음 페이지
import BoardTestEntry from "./BoardTestEntry.jsx";

// Board(QnA)
import QnAList from "./QnA/QnAList.jsx";
import QnARegister from "./QnA/QnARegister.jsx";
import QnARead from "./QnA/QnARead.jsx";
import QnAModify from "./QnA/QnAModify.jsx";
import QnADelete from "./QnA/QnADelete.jsx";

// Member
import TestUIPage from "../member/TestUIPage.jsx";
import TestRegisterPage from "../member/TestRegisterPage.jsx";
import TestMyPage from "../member/TestMyPage.jsx";
import TestMeasurement from "../member/TestMeasurement.jsx";
import SocialRegister from "../member/assets/SocialRegister.jsx";

export default {
    title: "Test/board/boardTest",
    component: BoardTestEntry,
    parameters: {
        reactRouterPath: "/board", // ✅ 기본 시작 루트는 /board
        reactExtraPath: [
            // Board(QnA)
            { path: "/qna", element: <QnAList /> },
            { path: "/qna/register", element: <QnARegister /> },
            { path: "/qna/read/:id", element: <QnARead /> },
            { path: "/qna/modify/:id", element: <QnAModify /> },
            { path: "/qna/delete/:id", element: <QnADelete /> },

            // Notify (임시: null)
            { path: "/notify", element: null },
            { path: "/notify/read/:id", element: null },

            // FAQ (임시: null)
            { path: "/faq", element: null },

            // Member
            { path: "/member", element: <TestUIPage /> },
            { path: "/member/signup", element: <TestRegisterPage /> },
            { path: "/member/mypage", element: <TestMyPage /> },
            { path: "/health/measurement", element: <TestMeasurement /> },
            { path: "/social/signup", element: <SocialRegister /> },
        ],
    },
};

// ✅ 기본 스토리: 진입 버튼 페이지
export const Entry = () => <BoardTestEntry />;
