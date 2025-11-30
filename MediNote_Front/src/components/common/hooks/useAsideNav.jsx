import {useState, useEffect, useCallback} from "react";

export function useAsideNav({
  items = [],
  defaultActiveId = null,
  componentMap = {},
  scrollOffset = 100,
  scrollToTopOnComponent = true,
} = {}) {
  // 1. 상태 관리
  const initialId = defaultActiveId || items[0]?.id || "";
  const [activeId, setActiveId] = useState(initialId);
  const [activeComponent, setActiveComponent] = useState(null);

  useEffect(() => {
    if (!activeComponent && initialId && componentMap[initialId]) {
      setActiveComponent(initialId);
    }
  }, []);


  // 2. 버튼 클릭 핸들러 (handleAction)
  const handleAction = useCallback((type, id) => {
    if (type === "component") {
      // 컴포넌트 버튼 클릭 (예: "설정", "프로필 관리")
      setActiveComponent(id);
      setActiveId(id);
    } else if (type === "scroll") {
      // 스크롤 버튼 클릭

      // profile-basic 같은 하위 섹션인지 체크
      const parentComponent = Object.keys(componentMap).find(key =>
          id.startsWith(`${key}-`)
      );

      if (parentComponent) {
        // 하위 섹션 → 부모 컴포넌트 유지하고 스크롤
        setActiveComponent(parentComponent);
        setActiveId(id);

        // DOM 렌더링 후 스크롤
        requestAnimationFrame(() => {
          setTimeout(() => {
            const el = document.getElementById(id);
            if (el) {
              const top = el.getBoundingClientRect().top + window.scrollY - scrollOffset;
              window.scrollTo({ top, behavior: "smooth" });
            }
          }, 100);
        });
      } else {
        // 일반 스크롤 섹션 → 컴포넌트 닫고 스크롤
        setActiveComponent(null);
        setActiveId(id);
      }
    }
  }, [componentMap, scrollOffset]);

  // 3. ScrollSpy 핸들러 (handleChange)
  const handleChange = useCallback((id) => {
    // ScrollSpy가 자동으로 감지했을 때
    setActiveId(id);
  }, []);

  // 4. 컴포넌트 전환 시 스크롤 처리
  useEffect(() => {
    if (!scrollToTopOnComponent || !activeComponent) return;

    // 컴포넌트 버튼 클릭 시에만 맨 위로 스크롤
    const isComponentButton = items.find(
        (item) => item.id === activeComponent && item.actionType === "component"
    );

    if (isComponentButton) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeComponent, items, scrollToTopOnComponent]);

  // 5. 현재 렌더링할 컴포넌트
  const ActiveComponent = activeComponent ? componentMap[activeComponent] : null;

  // 6. 유틸리티
  const isComponentMode = !!activeComponent;

  return {
    // 상태
    activeId,
    activeComponent,
    isComponentMode,

    // 렌더링할 컴포넌트
    ActiveComponent,

    // 핵심 핸들러 (AsideNav에 전달)
    handleAction,
    handleChange,

    // 직접 제어 (필요시)
    setActiveId,
    setActiveComponent,
  };
}