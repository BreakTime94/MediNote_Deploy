// src/components/faq/FaqWritePanel.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/components/common/hooks/useAuthStore.jsx";
import api from "../common/api/axiosInterceptor.js";

/**
 * FaqWritePanel - FAQ 작성 폼 (QnA/공지와 디자인 통일)
 *
 * POST /boards/register
 * BoardCreateRequestDTO(
 *   memberId, boardCategoryId, title, content,
 *   requireAdminPost, isPublic, qnaStatus, postStatus
 * )
 */
export default function FaQWritePanel({
                                          faqCategoryId = 3,                   // FAQ 카테고리
                                          defaultMemberIdForTest = 1,          // 로그인 없이 테스트 시 사용
                                          defaultPostStatus = "PUBLISHED",     // "PUBLISHED" | "HIDDEN"
                                          onCancel,
                                          onSuccess,
                                          listPath = "/boards/faq",
                                          readPathBuilder = (id) => `/boards/faq/read/${id}`,
                                      }) {
    const navigate = useNavigate();
    const { member } = useAuthStore();

    // 폼 상태
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [requireAdminPost, setRequireAdminPost] = useState(false);
    const [postStatus, setPostStatus] = useState(defaultPostStatus);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // 로그인 없어도 동작: 로그인 ID 없으면 테스트용 ID 사용
    const effectiveMemberId = member?.id ?? member?.memberId ?? defaultMemberIdForTest;

    const errors = useMemo(() => {
        const e = {};
        if (!title || title.trim().length < 2) e.title = "제목은 2자 이상 입력하세요.";
        if (!content || content.trim().length < 10) e.content = "내용은 10자 이상 입력하세요.";
        return e;
    }, [title, content]);

    const hasError = Object.keys(errors).length > 0;

    const handleCancel = () => {
        if (onCancel) return onCancel();
        navigate(listPath);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (hasError) return;

        setSubmitting(true);
        setError("");

        try {
            // DTO 스키마에 맞춰 전송 (FAQ라도 qnaStatus 필드가 있어 기본값 전송)
            const body = {
                memberId: effectiveMemberId,
                boardCategoryId: faqCategoryId,
                title: title.trim(),
                content: content.trim(),
                requireAdminPost,
                isPublic,
                qnaStatus: "WAITING",
                postStatus,
            };

            const res = await api.post("/boards/register", body);
            const newId = res?.data?.id;

            if (onSuccess) return onSuccess(newId);
            if (newId) navigate(readPathBuilder(newId));
            else navigate(listPath);
        } catch (err) {
            console.error(err);
            setError("등록에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="w-full max-w-5xl mx-auto">
            {/* 헤더 (디자인 통일) */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">FAQ 등록</h2>
                    <p className="text-sm text-gray-500 mt-1">자주 묻는 질문을 등록하세요.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="rounded-2xl px-4 py-2 shadow-sm ring-1 ring-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        form="faq-write-form"
                        disabled={submitting || hasError}
                        className="rounded-2xl px-4 py-2 shadow-sm text-white bg-gradient-to-r from-pink-300 to-purple-300 hover:opacity-90 transition disabled:opacity-60"
                    >
                        {submitting ? "등록 중…" : "등록"}
                    </button>
                </div>
            </div>

            {/* 폼 카드 */}
            <form
                id="faq-write-form"
                onSubmit={handleSubmit}
                className="rounded-3xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm space-y-6"
            >
                {/* 공개/상태/중요 여부 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 공개 여부 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">공개 여부</label>
                        <button
                            type="button"
                            onClick={() => setIsPublic((v) => !v)}
                            className={
                                "w-full px-3 py-2 rounded-xl text-sm ring-1 transition " +
                                (isPublic
                                    ? "bg-gradient-to-r from-pink-200 to-purple-200 text-gray-900 ring-transparent"
                                    : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50")
                            }
                            title={isPublic ? "현재: 공개" : "현재: 비공개"}
                        >
                            {isPublic ? "공개" : "비공개"}
                        </button>
                        <p className="mt-1 text-[11px] text-gray-500">비공개 시 관리자/작성자만 확인합니다.</p>
                    </div>

                    {/* 게시 상태 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">게시 상태</label>
                        <select
                            value={postStatus}
                            onChange={(e) => setPostStatus(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        >
                            <option value="PUBLISHED">게시(PUBLISHED)</option>
                            <option value="HIDDEN">숨김(HIDDEN)</option>
                        </select>
                        <p className="mt-1 text-[11px] text-gray-500">숨김은 임시 저장 용도로 활용할 수 있습니다.</p>
                    </div>

                    {/* 중요 FAQ (운영용) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">중요 표시</label>
                        <button
                            type="button"
                            onClick={() => setRequireAdminPost((v) => !v)}
                            className={
                                "w-full px-3 py-2 rounded-xl text-sm ring-1 transition " +
                                (requireAdminPost
                                    ? "bg-gradient-to-r from-pink-200 to-purple-200 text-gray-900 ring-transparent"
                                    : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50")
                            }
                            title={requireAdminPost ? "현재: 중요" : "현재: 일반"}
                        >
                            {requireAdminPost ? "중요" : "일반"}
                        </button>
                        <p className="mt-1 text-[11px] text-gray-500">상단 고정/강조 등에 사용할 수 있습니다.</p>
                    </div>
                </div>

                {/* 제목 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="예) 비밀번호를 잊어버렸어요"
                        className={`w-full rounded-xl border text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 ${
                            errors.title ? "border-rose-300" : "border-gray-200"
                        }`}
                        maxLength={160}
                    />
                    <div className="mt-1 flex items-center justify-between">
                        {errors.title ? (
                            <p className="text-xs text-rose-600">{errors.title}</p>
                        ) : (
                            <span className="text-xs text-gray-500">2~160자</span>
                        )}
                        <span className="text-[11px] text-gray-400">{title.length}/160</span>
                    </div>
                </div>

                {/* 내용 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="자주 묻는 질문에 대한 상세한 답변을 입력하세요."
                        className={`w-full min-h-[220px] rounded-xl border text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 resize-y ${
                            errors.content ? "border-rose-300" : "border-gray-200"
                        }`}
                    />
                    {errors.content ? (
                        <p className="mt-1 text-xs text-rose-600">{errors.content}</p>
                    ) : (
                        <p className="mt-1 text-xs text-gray-500">10자 이상 입력하세요.</p>
                    )}
                </div>

                {/* 에러 배너 */}
                {error && (
                    <div className="rounded-2xl bg-rose-50 text-rose-700 ring-1 ring-rose-200 px-4 py-3 text-sm">
                        {error}
                    </div>
                )}
            </form>
        </section>
    );
}
