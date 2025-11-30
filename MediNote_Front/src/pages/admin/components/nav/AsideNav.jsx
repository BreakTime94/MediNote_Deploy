import React, { useEffect, useRef, useState } from "react";
import { Button } from "../button/Button.jsx";

/**
 * 재사용 가능한 AsideNav
 *
 * props
 * - title?: string
 * - subtitle?: string
 * - items: { id: string, label: string, icon?: ReactNode, actionType?: "scroll" | "component", onClick?: () => void }[]
 * - className?: string
 * - sticky?: { enabled?: boolean, top?: number, width?: number }
 * - scroll?: { offset?: number, smooth?: boolean, spy?: boolean, syncHash?: boolean }
 * - ui?: { activeGradientClass?: string, inactiveHoverClass?: string, buttonHeightClass?: string }
 * - activeId?: string (Controlled mode - 외부에서 활성 항목 제어)
 * - defaultActiveId?: string
 * - onChange?: (id: string) => void
 * - onAction?: (type: "scroll" | "component", id: string) => void
 */
export default function AsideNav({
                                     title = "",
                                     subtitle = "",
                                     items = [],
                                     className = "",
                                     sticky = { enabled: true, top: 96, width: 260 },
                                     scroll = { offset: 80, smooth: true, spy: true, syncHash: false },
                                     ui = {
                                         activeGradientClass: "bg-grad-main",
                                         inactiveHoverClass: "hover:bg-gray-50",
                                         buttonHeightClass: "h-11",
                                     },
                                     activeId,
                                     defaultActiveId,
                                     onChange,
                                     onAction,
                                     activeComponentId,
                                 }) {
    const [innerActive, setInnerActive] = useState(
        defaultActiveId ?? items?.[0]?.id ?? ""
    );
    const isControlled = typeof activeId === "string";
    const currentActive = isControlled ? activeId : innerActive;

    const setActive = (id) => {
        if (!isControlled) setInnerActive(id);
        onChange?.(id);
    };

    const offset = scroll?.offset ?? 80;
    const smooth = scroll?.smooth ?? true;
    const spy = scroll?.spy ?? true;
    const syncHash = scroll?.syncHash ?? false;

    // ScrollSpy를 위한 스크롤 이벤트 기반 접근
    const scrollTimeoutRef = useRef(null);
    const isManualScrollRef = useRef(false);

    useEffect(() => {
        if (!spy) return;

        const scrollableItems = items.filter((it) => it.actionType !== "component");
        if (scrollableItems.length === 0) return;

        const handleScroll = () => {
            // 수동 스크롤 중에는 ScrollSpy 비활성화
            if (isManualScrollRef.current) return;

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            scrollTimeoutRef.current = setTimeout(() => {
                const scrollPosition = window.scrollY + offset + 10;

                // 모든 섹션의 위치를 확인
                let activeSection = null;
                let closestDistance = Infinity;

                scrollableItems.forEach((item) => {
                    const element = document.getElementById(item.id);
                    if (!element) return;

                    const rect = element.getBoundingClientRect();
                    const elementTop = rect.top + window.scrollY;
                    const elementBottom = elementTop + rect.height;

                    // 현재 스크롤 위치가 섹션 내부에 있는지 확인
                    if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
                        activeSection = item.id;
                        return;
                    }

                    // 가장 가까운 섹션 찾기
                    const distance = Math.abs(elementTop - scrollPosition);
                    if (distance < closestDistance && elementTop <= scrollPosition) {
                        closestDistance = distance;
                        activeSection = item.id;
                    }
                });

                // if (window.scrollY < 100) {
                //     if (activeComponentId) {
                //         activeSection = activeComponentId; // 컴포넌트 모드일 때는 무조건 상위 버튼 강조
                //     } else if (scrollableItems[0]) {
                //         activeSection = scrollableItems[0].id; // 문서 모드일 때는 개요 강조
                //     }
                // }

                if (activeSection) {
                    setActive(activeSection);
                    if (syncHash) {
                        window.history.replaceState(null, "", `#${activeSection}`);
                    }
                }
            }, 50);
        };

        // 초기 실행
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [spy, items, offset, syncHash]); // currentActive 제거로 무한 루프 방지

    // 클릭 동작
    const handleClick = (item) => {
        if (item.actionType === "component") {
            setActive(item.id);
            onAction?.("component", item.id);
            item.onClick?.();
            return;
        }

        // 스크롤 액션 (기본)
        const el = document.getElementById(item.id);

        if (el) {
            // 요소가 존재하면 스크롤
            isManualScrollRef.current = true;
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
            setActive(item.id);
            onAction?.("scroll", item.id);

            if (syncHash) {
                window.history.replaceState(null, "", `#${item.id}`);
            }

            // 스크롤 완료 후 ScrollSpy 재활성화
            setTimeout(() => {
                isManualScrollRef.current = false;
                el.setAttribute("tabindex", "-1");
                el.focus();
            }, smooth ? 800 : 100);
        } else {
            // 요소가 없으면 부모에게 알려서 컴포넌트를 닫고 섹션으로 복귀
            setActive(item.id);
            onAction?.("scroll", item.id);

            // DOM 렌더링 대기 후 스크롤
            const scrollToElement = () => {
                const element = document.getElementById(item.id);
                if (element) {
                    isManualScrollRef.current = true;
                    const top = element.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });

                    if (syncHash) {
                        window.history.replaceState(null, "", `#${item.id}`);
                    }

                    setTimeout(() => {
                        isManualScrollRef.current = false;
                        element.setAttribute("tabindex", "-1");
                        element.focus();
                    }, smooth ? 800 : 100);
                }
            };

            // requestAnimationFrame으로 렌더링 완료 대기
            requestAnimationFrame(() => {
                setTimeout(scrollToElement, 50);
            });
        }
    };

    // sticky 스타일
    const stickyEnabled = sticky?.enabled !== false;
    const stickyWidth = sticky?.width ?? 260;
    const stickyTop = sticky?.top ?? 96;

    const asideStyle = stickyEnabled
        ? { position: "sticky", top: `${stickyTop}px`, width: `${stickyWidth}px`}
        : {};

    return (
        <aside
            className={`w-full rounded-2xl border bg-white p-3 shadow-sm self-start ${className}`}
            style={asideStyle}
            role="navigation"
            aria-label={title || "사이드 네비게이션"}
        >
            {(title || subtitle) && (
                <header className="px-3 pt-1 pb-2">
                    {title && (
                        <h3 className="text-base font-semibold text-gray-800">
                            {title}
                        </h3>
                    )}
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                </header>
            )}

            <nav className="flex flex-col gap-2">
                {items.map((it) => {
                    const isActive = currentActive === it.id;
                    const common = `justify-start ${
                        ui.buttonHeightClass || "h-11"
                    } border`;
                    const activeCls = `${
                        ui.activeGradientClass || "bg-grad-main"
                    } text-white border-white/40 shadow-sm`;
                    const inactiveCls = `text-gray-700 border-gray-200 ${
                        ui.inactiveHoverClass || "hover:bg-gray-50"
                    }`;

                    return (
                        <Button
                            key={it.id}
                            onClick={() => handleClick(it)}
                            variant={isActive ? "gradient" : "white"}
                            radius="lg"
                            size="md"
                            fullWidth
                            aria-current={isActive ? "true" : "false"}
                            className={`${common} ${
                                isActive ? activeCls : inactiveCls
                            }`}
                        >
                            <span className="inline-flex items-center gap-2">
                                {it.icon}
                                {it.label}
                            </span>
                        </Button>
                    );
                })}
            </nav>
        </aside>
    );
}