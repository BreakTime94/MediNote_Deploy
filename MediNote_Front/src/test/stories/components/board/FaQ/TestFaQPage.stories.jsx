// src/test/stories/components/board/faq/TestFaQPage.stories.jsx
import React from "react";
import FaqList from "./FaqList.jsx";
import FaqRegister from "./FaqRegister.jsx";
import FaqEdit from "./FaqEdit.jsx";
import FaqRead from "./FaqRead.jsx"; // ✅ 단일 조회 컴포넌트 추가

export default {
    title: "Test/board/faq",
    component: FaqList,
    parameters: {
        // 기본 진입 경로
        reactRouterPath: "/faq",
        // 스토리에서 사용할 추가 라우트
        reactExtraPath: [
            { path: "/faq/register", element: <FaqRegister defaultMemberId={1} /> },
            { path: "/faq/modify/:id", element: <FaqEdit defaultMemberId={1} /> },
            { path: "/faq/read/:id", element: <FaqRead defaultMemberId={1} /> }, // ✅ 라우트 연결
        ],
    },
};

// 리스트 기본
export const FAQ = (args) => <FaqList {...args} />;
FAQ.args = { defaultPageSize: 10 };

// 등록 폼 단독 스토리
export const Register = (args) => <FaqRegister {...args} />;
Register.args = { defaultMemberId: 1 };
Register.parameters = {
    reactRouterPath: "/faq/register",
};

// 수정 폼 단독 스토리 (id=1 예시)
export const Edit = (args) => <FaqEdit {...args} />;
Edit.args = { defaultMemberId: 1 };
Edit.parameters = {
    reactRouterPath: "/faq/modify/1",
};

// ✅ 단일 조회 스토리 (id=1 예시)
export const Read = (args) => <FaqRead {...args} />;
Read.args = { defaultMemberId: 1 };
Read.parameters = {
    reactRouterPath: "/faq/read/1",
};