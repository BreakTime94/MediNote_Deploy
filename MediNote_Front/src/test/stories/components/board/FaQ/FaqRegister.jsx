import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// 배포 시 재사용할 인터셉터(지금은 주석 처리 상태로 유지)
import api from "../../member/axiosInterceptor.js";
import axios from "axios";

export default function FaqRegister({
                                        defaultMemberId = 1,
                                        defaultIsPublic = true,
                                        defaultRequireAdminPost = false,
                                        defaultPostStatus = "PUBLISHED",
                                    }) {
    const nav = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isPublic, setIsPublic] = useState(defaultIsPublic);
    const [requireAdminPost, setRequireAdminPost] = useState(defaultRequireAdminPost);
    const [postStatus, setPostStatus] = useState(defaultPostStatus);

    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    const canSubmit = title.trim() && content.trim() && !pending;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;

        setPending(true);
        setError("");

        try {
            const body = {
                memberId: defaultMemberId,
                boardCategoryId: 3,
                title: title.trim(),
                content: content.trim(),
                requireAdminPost,
                isPublic,
                qnaStatus: null,
                postStatus,
            };

            // ✅ 임시: 게이트웨이 우회, 백엔드(8082)로 직접 전송
            const res = await axios.post("http://localhost:8082/api/boards", body, {
                headers: { "Content-Type": "application/json" },
                withCredentials: false,
            });

            // 📌 나중에 게이트웨이 복귀 시 아래로 교체
            // const res = await api.post("/boards", body);

            const id = res?.data?.id;
            if (id) nav(`/faq/read/${id}`);
            else setError("등록은 성공했지만 ID를 받지 못했습니다.");
        } catch (err) {
            console.error("FAQ 등록 실패:", err);
            const msg =
                err?.response?.data?.messages?.join(", ") ||
                err?.response?.data?.message ||
                err?.response?.statusText ||
                err?.message ||
                "FAQ 등록 중 오류가 발생했습니다.";
            setError(msg);
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="w-full max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">FAQ 등록</h2>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 제목 */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        제목 <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="예) 로그인 오류 해결 방법"
                        className="w-full rounded-lg border border-[var(--border-soft)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                    />
                </div>

                {/* 본문 */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        내용 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={8}
                        placeholder="FAQ 본문 내용을 입력하세요."
                        className="w-full resize-y rounded-lg border border-[var(--border-soft)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                    />
                </div>

                {/* 옵션 */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-2">
                        <input
                            id="isPublic"
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="h-4 w-4"
                        />
                        <label htmlFor="isPublic" className="text-sm text-gray-700">공개</label>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="requireAdminPost"
                            type="checkbox"
                            checked={requireAdminPost}
                            onChange={(e) => setRequireAdminPost(e.target.checked)}
                            className="h-4 w-4"
                        />
                        <label htmlFor="requireAdminPost" className="text-sm text-gray-700">
                            관리자 등록 요구
                        </label>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">상태</label>
                        <select
                            value={postStatus}
                            onChange={(e) => setPostStatus(e.target.value)}
                            className="w-full rounded-lg border border-[var(--border-soft)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                        >
                            <option value="PUBLISHED">PUBLISHED</option>
                            <option value="HIDDEN">HIDDEN</option>
                            <option value="DELETED">DELETED</option>
                            <option value="DRAFT">DRAFT</option>
                        </select>
                    </div>
                </div>

                {/* 액션 */}
                <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={() => nav("/faq")}
                        className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                        disabled={pending}
                    >
                        목록
                    </button>
                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="rounded-xl bg-grad-main px-4 py-2 text-sm text-white transition enabled:hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {pending ? "등록 중..." : "등록"}
                    </button>
                </div>
            </form>
        </div>
    );
}
