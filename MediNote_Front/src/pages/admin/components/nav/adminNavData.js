export const AdminNavData = [
    {
        label: "회원관리",
        path: "/admin/main/member",
        children: [
            { label: "회원조회", path: "/about/project" },
        ],
    },
    {
        label: "게시판관리",
        path: "/admin/main/board",
        children: [
            { label: "건강정보 등록", path: "/mycare/dashboard" },
            { label: "건강정보 조회", path: "/mycare/meds" },
            { label: "건강정보 차트", path: "/mycare/vitals" },
        ],
    },
];