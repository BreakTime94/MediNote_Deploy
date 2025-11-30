// test/stories/pages/index/IndexPage.stories.jsx
import React from "react";
import IndexPage from "./IndexPage.jsx";

// 스토리북 글로벌 데코레이터가 reactRouterPath / reactExtraPath를 읽어
// MemoryRouter를 구성한다고 가정(팀 공통 양식)


export default {
    title: "Test/page/index",
    component: IndexPage,
    parameters: {
        reactRouterPath: "/",               // 기본 진입 경로
        reactExtraPath: [

        ],
    },
};

export const Default = () => <IndexPage />;