// src/components/news/NewsLayout.jsx
import React, { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AsideNav from "../../components/common/nav/AsideNav.jsx";

export default function NewsLayout() {
    const nav = useNavigate();
    const { pathname } = useLocation();

    // 현재 탭(active) 계산
    const activeTopTab = useMemo(() => {
        if (pathname.startsWith("/columns")) return "columns";
        if (pathname.startsWith("/health-info")) return "health-info";
        return "news";
    }, [pathname]);

    const items = [
        // 상단 탭: 라우팅 전환 (component)
        { id: "news",        label: "뉴스",     actionType: "component", onClick: () => nav("/news") },
        { id: "columns",     label: "칼럼",     actionType: "component", onClick: () => nav("/columns") },
        { id: "health-info", label: "건강정보", actionType: "component", onClick: () => nav("/health-info") },
    ];

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 px-6 md:px-8 pt-8 md:pt-10 pb-10">
            {/* 좌측 Aside (고정) */}
            <div className="col-span-12 md:col-span-3">
                <AsideNav
                    title="헬스인사이트"
                    subtitle="뉴스 · 칼럼 · 건강정보"
                    items={items}
                    sticky={{ enabled: true, top: 96, width: 260 }}
                    scroll={{ offset: 80, smooth: true, spy: true, syncHash: false }}
                    // 상단 탭 활성 제어
                    activeId={activeTopTab}
                    onChange={() => {}}
                />
            </div>

            {/* 우측 콘텐츠 (자식 라우트가 교체 렌더) */}
            <div className="col-span-12 md:col-span-9">
                <Outlet />
            </div>
        </div>
    );
}
