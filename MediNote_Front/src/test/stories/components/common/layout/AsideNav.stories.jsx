import React, { useEffect, useState } from "react";
import AsideNav from "./AsideNav.jsx";

const demoItems = [
    { id: "overview", label: "개요", actionType: "scroll" },
    { id: "features", label: "주요 기능", actionType: "scroll" },
    { id: "pricing", label: "요금제", actionType: "scroll" },
    { id: "faq", label: "FAQ", actionType: "scroll" },
    {
        id: "settings",
        label: "⚙️ 설정",
        actionType: "component",
    },
    {
        id: "profile",
        label: "👤 프로필 관리",
        actionType: "component",
    },
    // 프로필 관리 내부 섹션들
    {
        id: "profile-basic",
        label: "  ↳ 기본 정보",
        actionType: "scroll",
    },
    {
        id: "profile-security",
        label: "  ↳ 보안 설정",
        actionType: "scroll",
    },
    {
        id: "profile-preferences",
        label: "  ↳ 개인화 설정",
        actionType: "scroll",
    },
];

function DemoPage({ children }) {
    return (
        <div className="mx-auto max-w-7xl grid grid-cols-[280px_1fr] gap-6 p-6 min-h-[250vh]">
            {children}
        </div>
    );
}

function Section({ id, title, lines = 20 }) {
    return (
        <section id={id} className="mb-16 scroll-mt-[100px]">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 pt-4">{title}</h2>
            <div className="space-y-3">
                {[...Array(lines)].map((_, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed">
                        {title} 섹션의 {i + 1}번째 문단입니다. 스크롤 스파이 기능을
                        테스트하기 위한 충분한 양의 콘텐츠를 제공합니다. 페이지를
                        천천히 스크롤하면 왼쪽 네비게이션이 자동으로 현재 위치를
                        추적하며 활성 버튼이 변경되는 것을 확인할 수 있습니다.
                    </p>
                ))}
            </div>
        </section>
    );
}

export default {
    title: "TEST/nav/AsideNav",
    component: AsideNav,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "스크롤 스파이와 sticky 기능을 지원하는 사이드 네비게이션 컴포넌트. 스크롤 섹션과 컴포넌트 액션을 자유롭게 전환할 수 있습니다.",
            },
        },
    },
};

/** ▼ 더미 컴포넌트들 */
function SettingsComponent() {
    return (
        <div className="rounded-2xl border shadow-sm p-8 bg-white">
            <h2 className="text-2xl font-bold mb-4">⚙️ 설정</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h3 className="font-semibold">알림 설정</h3>
                        <p className="text-sm text-gray-500">이메일 알림을 받을지 선택합니다</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h3 className="font-semibold">다크 모드</h3>
                        <p className="text-sm text-gray-500">화면 테마를 변경합니다</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h3 className="font-semibold">자동 저장</h3>
                        <p className="text-sm text-gray-500">작업 내용을 자동으로 저장합니다</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" defaultChecked />
                </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 font-semibold mb-2">
                    ✅ 모든 기능이 정상 작동합니다!
                </p>
                <ul className="text-sm text-blue-600 space-y-1">
                    <li>• "개요" 클릭 → 설정 닫히고 개요로 정확히 스크롤</li>
                    <li>• "프로필 관리" 클릭 → 프로필 화면으로 즉시 전환</li>
                    <li>• "설정" 버튼이 그라데이션으로 강조됨</li>
                    <li>• 페이지가 맨 위로 스크롤됨</li>
                </ul>
            </div>
        </div>
    );
}

function ProfileComponent() {
    return (
        <div className="rounded-2xl border shadow-sm p-8 bg-white">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">👤 프로필 관리</h2>

            <div className="mb-8 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-700 font-semibold mb-2">
                    ✨ 컴포넌트 내부 ScrollSpy 테스트
                </p>
                <ul className="text-sm text-purple-600 space-y-1">
                    <li>• 이 페이지를 스크롤하면 왼쪽 네비게이션이 자동으로 업데이트됩니다</li>
                    <li>• "기본 정보", "보안 설정", "개인화 설정" 버튼을 클릭해보세요</li>
                    <li>• 다른 문서 섹션(개요, FAQ)으로도 자유롭게 이동 가능합니다</li>
                </ul>
            </div>

            {/* 기본 정보 섹션 */}
            <section id="profile-basic" className="mb-16 scroll-mt-[100px]">
                <h3 className="text-xl font-bold mb-4 text-gray-800">기본 정보</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">이름</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="홍길동"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">이메일</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="example@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">전화번호</label>
                        <input
                            type="tel"
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="010-1234-5678"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">소개</label>
                        <textarea
                            className="w-full px-4 py-2 border rounded-lg"
                            rows={4}
                            placeholder="자기소개를 입력하세요"
                        />
                    </div>
                    {/* 스크롤 공간 확보 */}
                    {[...Array(5)].map((_, i) => (
                        <p key={i} className="text-gray-500 text-sm">
                            기본 정보 섹션의 추가 내용입니다. ScrollSpy 테스트를 위한 더미 텍스트입니다.
                        </p>
                    ))}
                </div>
            </section>

            {/* 보안 설정 섹션 */}
            <section id="profile-security" className="mb-16 scroll-mt-[100px]">
                <h3 className="text-xl font-bold mb-4 text-gray-800">보안 설정</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">현재 비밀번호</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="********"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">새 비밀번호</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="********"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">비밀번호 확인</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="********"
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-semibold">2단계 인증</h4>
                            <p className="text-sm text-gray-500">추가 보안 계층 활성화</p>
                        </div>
                        <input type="checkbox" className="w-5 h-5" />
                    </div>
                    {/* 스크롤 공간 확보 */}
                    {[...Array(8)].map((_, i) => (
                        <p key={i} className="text-gray-500 text-sm">
                            보안 설정 섹션의 추가 내용입니다. ScrollSpy가 이 섹션을 감지할 수 있도록 충분한 높이를 제공합니다.
                        </p>
                    ))}
                </div>
            </section>

            {/* 개인화 설정 섹션 */}
            <section id="profile-preferences" className="mb-8 scroll-mt-[100px]">
                <h3 className="text-xl font-bold mb-4 text-gray-800">개인화 설정</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-semibold">이메일 알림</h4>
                            <p className="text-sm text-gray-500">중요한 업데이트를 이메일로 받기</p>
                        </div>
                        <input type="checkbox" className="w-5 h-5" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-semibold">다크 모드</h4>
                            <p className="text-sm text-gray-500">어두운 테마 사용</p>
                        </div>
                        <input type="checkbox" className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-semibold">언어 설정</h4>
                            <p className="text-sm text-gray-500">한국어</p>
                        </div>
                        <select className="px-3 py-1 border rounded-lg">
                            <option>한국어</option>
                            <option>English</option>
                            <option>日本語</option>
                        </select>
                    </div>
                    {/* 스크롤 공간 확보 */}
                    {[...Array(10)].map((_, i) => (
                        <p key={i} className="text-gray-500 text-sm">
                            개인화 설정 섹션의 추가 내용입니다. 이 섹션이 충분히 길어야 ScrollSpy가 제대로 작동합니다.
                        </p>
                    ))}
                </div>
            </section>

            <button
                type="button"
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
            >
                모든 변경사항 저장
            </button>
        </div>
    );
}

/** ▼ 컴포넌트 매핑 */
const COMPONENT_MAP = {
    settings: SettingsComponent,
    profile: ProfileComponent,
};

/** ▼ Template */
const Template = (args) => {
    const [activeId, setActiveId] = useState(args.items?.[0]?.id || "overview");
    const [activeComponent, setActiveComponent] = useState(null);

    const handleAction = (type, id) => {
        if (type === "component") {
            setActiveComponent(id);
            setActiveId(id);
        } else if (type === "scroll") {
            if (id.startsWith("profile-")) {
                setActiveComponent("profile");
                setActiveId(id);
                // ProfileComponent 로드 후 스크롤
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        const el = document.getElementById(id);
                        if (el) {
                            const top = el.getBoundingClientRect().top + window.scrollY - 100;
                            window.scrollTo({ top, behavior: "smooth" });
                        }
                    }, 100);
                });
            } else {
                setActiveComponent(null);
                setActiveId(id);
            }
        }
    };

    const handleChange = (id) => {
        // ScrollSpy가 감지했을 때: activeComponent 유지
        setActiveId(id);
    };

    useEffect(() => {
        if (activeComponent) {
            // 컴포넌트 버튼 클릭 시에만 맨 위로 스크롤
            const isComponentButton = demoItems.find(
                (item) => item.id === activeComponent && item.actionType === "component"
            );
            if (isComponentButton) {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    }, [activeComponent]);

    const ActiveComponent = activeComponent ? COMPONENT_MAP[activeComponent] : null;

    return (
        <DemoPage>
            <AsideNav
                {...args}
                activeId={activeId}
                onChange={handleChange}
                onAction={handleAction}
            />
            <main className="bg-white border rounded-2xl p-8 shadow-sm">
                {ActiveComponent ? (
                    <ActiveComponent />
                ) : (
                    <>
                        <h1 className="text-3xl font-bold mb-8 text-gray-900">문서 제목</h1>
                        <div className="mb-12 p-6 bg-green-50 rounded-lg border border-green-200">
                            <h3 className="font-semibold text-green-800 mb-3">
                                🎯 완벽하게 작동하는 기능들
                            </h3>
                            <ol className="text-sm text-green-700 space-y-2">
                                <li><strong>1. ScrollSpy:</strong> 스크롤하면 왼쪽 버튼 자동 강조</li>
                                <li><strong>2. 컴포넌트 렌더링:</strong> "설정" 클릭 → 설정 화면 + 버튼 강조 + 맨 위로 스크롤</li>
                                <li><strong>3. 정확한 스크롤:</strong> 설정 화면에서 "개요" 클릭 → 개요 섹션으로 정확히 이동 (한 번에!)</li>
                                <li><strong>4. 컴포넌트 전환:</strong> "프로필" → "설정" 즉시 전환 + 맨 위로 스크롤</li>
                                <li><strong>5. 버튼 강조:</strong> 현재 위치에 맞는 버튼이 항상 그라데이션으로 표시</li>
                            </ol>
                        </div>
                        <Section id="overview" title="개요" lines={18} />
                        <Section id="features" title="주요 기능" lines={20} />
                        <Section id="pricing" title="요금제" lines={18} />
                        <Section id="faq" title="FAQ" lines={22} />
                    </>
                )}
            </main>
        </DemoPage>
    );
};

/** ▼ 기본 스토리 */
export const Default = Template.bind({});
Default.storyName = "기본 (혼합 모드)";
Default.args = {
    title: "문서 + 기능",
    subtitle: "스크롤과 컴포넌트 자유 전환",
    items: demoItems,
    sticky: { enabled: true, top: 24, width: 260 },
    scroll: { offset: 100, smooth: true, spy: true, syncHash: false },
};

/** ▼ 스크롤 전용 */
export const ScrollOnly = Template.bind({});
ScrollOnly.storyName = "스크롤 전용";
ScrollOnly.args = {
    title: "문서 목차",
    subtitle: "스크롤 시 자동 추적",
    items: demoItems.filter((item) => item.actionType === "scroll"),
    sticky: { enabled: true, top: 24, width: 260 },
    scroll: { offset: 100, smooth: true, spy: true, syncHash: false },
};

/** ▼ Sticky 비활성화 */
export const WithoutSticky = Template.bind({});
WithoutSticky.storyName = "Sticky 비활성화";
WithoutSticky.args = {
    title: "고정 없는 네비게이션",
    subtitle: "스크롤하면 함께 움직임",
    items: demoItems,
    sticky: { enabled: false },
    scroll: { offset: 80, smooth: true, spy: true, syncHash: false },
};

/** ▼ 커스텀 스타일 */
export const CustomStyle = Template.bind({});
CustomStyle.storyName = "커스텀 스타일";
CustomStyle.args = {
    title: "커스텀 디자인",
    subtitle: "핑크-퍼플 그라데이션",
    items: demoItems,
    sticky: { enabled: true, top: 24, width: 260 },
    scroll: { offset: 100, smooth: true, spy: true, syncHash: false },
    ui: {
        activeGradientClass: "bg-gradient-to-r from-pink-400 to-purple-400",
        inactiveHoverClass: "hover:bg-purple-50",
        buttonHeightClass: "h-12",
    },
};