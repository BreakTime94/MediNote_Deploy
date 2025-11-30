// src/pages/news/NewsPage.jsx
import React from "react";
import AsideNav from "../../components/common/nav/AsideNav.jsx";
import NewsNewsPanel from "@/components/news/NewsNewsPanel.jsx";
import { useAsideNav } from "@/components/common/hooks/useAsideNav.jsx";

export default function NewsPage() {
    // 네비게이션 아이템 정의
    const items = [
        { id: "latest", label: "최신", actionType: "scroll" },
        { id: "search-result", label: "검색 결과", actionType: "scroll" },
    ];

    // 컴포넌트 맵 (scroll 모드에서는 빈 객체)
    const componentMap = {};

    // useAsideNav 훅 사용 (MyPage와 동일한 방식)
    const {
        activeId,
        handleAction,
        handleChange,
    } = useAsideNav({
        items,
        componentMap,
        defaultActiveId: "latest",
        scrollOffset: 80,
        scrollToTopOnComponent: false, // scroll 모드에서는 false
    });

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 px-6 md:px-8 py-6">
            <div className="col-span-12 md:col-span-3">
                <AsideNav
                    title="뉴스"
                    items={items}
                    sticky={{ enabled: true, top: 96, width: 260 }}
                    scroll={{ offset: 80, smooth: true, spy: true }}
                    ui={{
                        // 활성시에 필요한 것들을 한 번에
                        activeGradientClass:
                            "bg-gradient-to-r from-pink-400 to-purple-400 text-white border-transparent",
                        inactiveHoverClass: "hover:bg-gray-50",
                        buttonHeightClass: "h-11",
                    }}

                    activeId={activeId}
                    onChange={handleChange}
                    onAction={handleAction}
                />
            </div>
            <div className="col-span-12 md:col-span-9">
                <NewsNewsPanel />
            </div>
        </div>
    );
}