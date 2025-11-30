import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * 🎯 마이페이지 전용 useAsideNav 훅
 * 기존 useAsideNav의 scroll 기능은 제거하고
 * component 전환 로직만 남긴 경량 버전
 *
 * 사용 예시:
 * const { activeId, ActiveComponent, handleAction, handleChange, setActiveComponentId } =
 *     useAsideNavMyPage({ items, componentMap, defaultActiveId: "profile" });
 */
export function useAsideNavMyPage({
                                    items = [],
                                    defaultActiveId = null,
                                    componentMap = {},
                                    scrollToTopOnComponent = true,
                                  } = {}) {
  // 1️⃣ 현재 활성된 버튼 id (네비 강조용)
  const initialId = defaultActiveId || items[0]?.id || "";
  const [activeId, setActiveId] = useState(initialId);

  // 2️⃣ 실제 렌더링할 컴포넌트 id (화면 전환용)
  const [activeComponentId, setActiveComponentId] = useState(initialId);

  // 3️⃣ 현재 활성화된 컴포넌트 계산
  const ActiveComponent = useMemo(() => {
    return componentMap[activeComponentId] || null;
  }, [activeComponentId, componentMap]);

  // 4️⃣ 네비 클릭 시 처리
  const handleAction = useCallback((type, id) => {
    if (type === "component") {
      setActiveId(id);
      setActiveComponentId(id);
    }
  }, []);

  // 5️⃣ ScrollSpy 대체용 (AsideNav에서 자동 감지)
  const handleChange = useCallback((id) => {
    setActiveId(id);
  }, []);

  // 6️⃣ 컴포넌트 전환 시 맨 위로 스크롤
  useEffect(() => {
    if (!scrollToTopOnComponent || !activeComponentId) return;
    const isComponentButton = items.find(
        (item) =>
            item.id === activeComponentId && item.actionType === "component"
    );
    if (isComponentButton) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeComponentId, items, scrollToTopOnComponent]);

  return {
    activeId,
    ActiveComponent,
    handleAction,
    handleChange,
    setActiveId,
    setActiveComponentId,
  };
}
