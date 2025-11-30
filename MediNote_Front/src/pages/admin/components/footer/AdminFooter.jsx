import React from "react";
import clsx from "clsx";

function AdminFooter() {
    const linkStyle = clsx(
        "text-sm",
        "text-gray-500",
        "hover:text-gray-800",
        "transition-colors"
    );

    return (
        <footer
            className={clsx(
                "border-t",
                "bg-gray-50",
                "py-6",
                "mt-10",
                "w-full"
            )}
        >
            {/* 좌우 여백 없이 화면 가득 채우기 */}
            <div className="w-full max-w-screen-2xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* 왼쪽: 저작권 */}
                <p className="text-sm text-gray-500">
                    © 2025 <span className="font-semibold">DevPill</span>. All rights reserved.
                </p>

                {/* 오른쪽: 링크 */}
                <nav className="flex flex-wrap gap-4">
                    <a href="/about/team" className={linkStyle}>
                        팀 소개
                    </a>
                    <a href="/terms" className={linkStyle}>
                        이용약관
                    </a>
                    <a href="/privacy" className={linkStyle}>
                        개인정보 처리방침
                    </a>
                    <a href="/support" className={linkStyle}>
                        고객센터
                    </a>
                    <a
                        href="https://github.com/DevPill"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkStyle}
                    >
                        GitHub
                    </a>
                </nav>
            </div>
        </footer>
    );
}

export default AdminFooter;
