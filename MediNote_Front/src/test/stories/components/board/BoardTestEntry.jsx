import React from "react";
import { Link } from "react-router-dom";

export default function BoardTestEntry() {
    const linkCls =
        "block px-4 py-2 rounded-lg border mb-2 text-sm font-medium text-center " +
        "bg-gray-100 hover:bg-gray-200 text-gray-800 transition";

    const disabledCls =
        "block px-4 py-2 rounded-lg border mb-2 text-sm font-medium text-center " +
        "bg-gray-200 text-gray-400 cursor-not-allowed";

    return (
        <div className="max-w-md mx-auto mt-10 space-y-4">
            <h1 className="text-2xl font-bold text-center mb-6">Board / Member Test Entry</h1>

            {/* QnA */}
            <div>
                <h2 className="text-lg font-semibold mb-2">QnA</h2>
                <Link to="/qna" className={linkCls}>QnA 목록</Link>
                <Link to="/qna/register" className={linkCls}>QnA 등록</Link>
            </div>

            {/* Notify */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Notify</h2>
                <button className={disabledCls} disabled>알림 목록 (미구현)</button>
            </div>

            {/* FAQ */}
            <div>
                <h2 className="text-lg font-semibold mb-2">FAQ</h2>
                <button className={disabledCls} disabled>FAQ 목록 (미구현)</button>
            </div>

            {/* Member */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Member</h2>
                <Link to="/member" className={linkCls}>로그인</Link>
                <Link to="/member/signup" className={linkCls}>회원가입</Link>
                <Link to="/member/mypage" className={linkCls}>마이페이지</Link>
                <Link to="/health/measurement" className={linkCls}>건강 측정</Link>
                <Link to="/social/signup" className={linkCls}>소셜 회원가입</Link>
            </div>
        </div>
    );
}
