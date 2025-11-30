import React from "react";
import { Button } from "./Button.jsx";

const SearchIcon = (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...props}>
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" />
    </svg>
);

/**
 * ButtonsPage
 * - Storybook "Playground" 제어를 위해 주요 props를 그대로 노출
 * - 아래 섹션들은 Showcase 용도로 고정 샘플을 보여줌
 */
export default function ButtonsPage({
                                        variant = "white",
                                        size = "md",
                                        radius = "pill",
                                        fullWidth = false,
                                        loading = false,
                                        as,
                                        href,
                                        children = "버튼",
                                    }) {
    return (
        <div className="flex flex-col gap-8 min-w-[320px]">
            {/* Playground */}
            <section className="space-y-2">
                <h3 className="text-base font-semibold">Playground</h3>
                <div className="flex gap-3">
                    <Button
                        variant={variant}
                        size={size}
                        radius={radius}
                        fullWidth={fullWidth}    // ➋ fullWidth prop 전달
                        loading={loading}
                        as={as}
                        href={href}
                    >
                        {children}
                    </Button>
                </div>
            </section>

            {/* 이하 Showcase 섹션들… */}
            <section className="space-y-2">
                <h3 className="text-base font-semibold">Sizes</h3>
                <div className="flex items-center gap-3">
                    <Button size="sm">SM</Button>
                    <Button size="md">MD</Button>
                    <Button size="lg">LG</Button>
                </div>
            </section>

            <section className="space-y-2">
                <h3 className="text-base font-semibold">Variants</h3>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="white">White</Button>
                    <Button variant="gradient">Gradient</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                </div>
            </section>

            <section className="space-y-2">
                <h3 className="text-base font-semibold">With Icons</h3>
                <div className="flex gap-3">
                    <Button variant="white" leftIcon={<SearchIcon />}>검색</Button>
                    <Button variant="gradient" rightIcon={<SearchIcon />}>찾기</Button>
                </div>
            </section>

            <section className="space-y-2">
                <h3 className="text-base font-semibold">States</h3>
                <div className="flex gap-3">
                    <Button variant="white" loading>처리 중...</Button>
                    <Button variant="white" as="a" href="#">링크 형태</Button>
                    <Button variant="outline" disabled>비활성</Button>
                </div>
            </section>
        </div>
    );
}