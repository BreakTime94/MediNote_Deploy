export const NavData = [
    {
        id: "intro",
        label: "소개",
        path: "/coming-soon",
        children: [
            { id: "intro-project", label: "프로젝트 소개", path: "/coming-soon" },
            { id: "intro-philosophy", label: "철학 & 가치", path: "/coming-soon" },
            { id: "intro-team", label: "팀 소개", path: "/coming-soon" },
        ],
    },
    {
        id: "mycare",
        label: "마이케어",
        path: "/mycare",
        children: [
            { id: "mycare-register", label: "건강정보 등록", path: "/mycare/register" },
            { id: "mycare-list", label: "건강정보 조회", path: "/mycare/list" },
            { id: "mycare-chart", label: "건강정보 차트", path: "/mycare/chart" },
        ],
    },
    {
        id: "insight",
        label: "헬스인사이트",
        path: "/news",
        children: [
            { id: "insight-news", label: "뉴스", path: "/news" },
            { id: "insight-columns", label: "칼럼", path: "/columns" },
            { id: "insight-health-info", label: "건강정보", path: "/health-info" },
        ],
    },
    {
        id: "finder",
        label: "헬스파인더",
        path: "/coming-soon",
        children: [
            { id: "finder-checkup", label: "건강검진", path: "/coming-soon" },
            { id: "finder-vaccine", label: "예방접종", path: "/coming-soon" },
            { id: "finder-workout", label: "운동 프로그램", path: "/coming-soon" },
        ],
    },
    {
        id: "map",
        label: "내주변 병원",
        path: "/map",
    },
    {
        id: "support",
        label: "고객지원",
        path: "/boards/notice",
        children: [
            { id: "support-notice", label: "공지사항", path: "/boards/notice" },
            { id: "support-faq", label: "자주 묻는 질문(FAQ)", path: "/boards/faq" },
            { id: "support-qna", label: "질문답변(QnA)", path: "/boards/qna" },
        ],
    },
];
