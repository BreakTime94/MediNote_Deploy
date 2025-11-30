import React from "react";
import Footer from "./Footer.jsx";

export default {
    title: "TEST/layout/Footer",
    component: Footer,
    parameters: {
        layout: "fullscreen",
        reactRouterPath: "/",
        reactExtraPath: [],
    },
};

export const Default = () => (
    <div className="min-h-dvh flex flex-col bg-white">
        <main className="flex-1 max-w-screen-2xl mx-auto p-6 text-gray-700">
            본문 더미 콘텐츠
        </main>
        <Footer />
    </div>
);