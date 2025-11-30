// src/components/common/ComingSoon.jsx
import React from "react";

export default function ComingSoon({
                                       title = "추후 개발 예정입니다",
                                       description = "조금만 기다려 주세요!",
                                       className = "",
                                   }) {
    return (
        <section className={`flex min-h-[40vh] items-center justify-center p-8 ${className}`}>
            <div className="text-center rounded-2xl border border-gray-200/70 shadow-sm p-10 max-w-lg">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    {/* 아이콘 */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeWidth="1.5" d="M12 6v6l4 2m5-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>

                <h1 className="text-2xl font-semibold">{title}</h1>
                <p className="mt-2 text-gray-500">{description}</p>

                <div className="mt-6">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition"
                    >
                        이전 페이지로
                    </button>
                </div>
            </div>
        </section>
    );
}
