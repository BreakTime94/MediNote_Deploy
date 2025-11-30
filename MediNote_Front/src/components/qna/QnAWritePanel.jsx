// src/components/qna/QnAWritePanel.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/components/common/hooks/useAuthStore.jsx";
import api from "../common/api/axiosInterceptor.js";

/**
 * QnAWritePanel - QnA 작성 (테스트 모드: 로그인 없어도 동작)
 *
 * 백엔드 규약:
 * POST /boards/register
 * BoardCreateRequestDTO(
 *   memberId, boardCategoryId, title, content,
 *   requireAdminPost, isPublic, qnaStatus, postStatus
 * )
 */
export default function QnAWritePanel({
                                          qnaCategoryId = 2,      // QnA 카테고리 고정
                                          onCancel,
                                          onSuccess,
                                          /** 로그인 없이 테스트할 때 사용할 memberId (null이면 로그인 값 사용) */
                                          defaultMemberIdForTest = 1,
                                      }) {
    const navigate = useNavigate();
    const { member } = useAuthStore(); // { id, memberId, ... } 가정

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // ✅ 로그인 없어도 동작: 로그인 값이 없으면 defaultMemberIdForTest 사용
    const effectiveMemberId =
        member?.id ?? member?.memberId ?? defaultMemberIdForTest;

    const errors = useMemo(() => {
        const e = {};
        // 🔻 로그인 체크 제거 (테스트 모드)
        if (!title || title.trim().length < 2) e.title = "제목은 2자 이상";
        if (!content || content.trim().length < 10) e.content = "내용은 10자 이상";
        return e;
    }, [title, content]);

    const hasError = Object.keys(errors).length > 0;

    const handleCancel = () => {
        if (onCancel) return onCancel();
        navigate("/boards/qna");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (hasError) return;
        setSubmitting(true);
        setError("");

        try {
            const body = {
                memberId: effectiveMemberId,     // ✅ 로그인 없어도 값 보냄
                boardCategoryId: qnaCategoryId,  // QnA = 2
                title: title.trim(),
                content: content.trim(),
                requireAdminPost: false,
                isPublic,
                qnaStatus: "WAITING",
                postStatus: "PUBLISHED",
            };

            const res = await api.post("/boards/register", body);
            const newId = res?.data?.id;

            if (onSuccess) return onSuccess(newId);
            if (newId) navigate(`/boards/qna/read/${newId}`);
            else navigate("/boards/qna");
        } catch (err) {
            console.error(err);
            setError("등록 실패. 잠시 후 다시 시도하세요.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="w-full max-w-5xl mx-auto">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">QnA 작성</h2>
                    <p className="text-sm text-gray-500 mt-1">궁금한 내용을 자세히 남겨주세요.</p>
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
                        form="qna-write-form"
                        disabled={submitting || hasError}
                        className="rounded-2xl px-4 py-2 shadow-sm text-white bg-gradient-to-r from-pink-300 to-purple-300 hover:opacity-90 transition disabled:opacity-60"
                    >
                        {submitting ? "등록 중…" : "등록"}
                    </button>
                </div>
            </div>

            {/* 폼 카드 */}
            <form
                id="qna-write-form"
                onSubmit={handleSubmit}
                className="rounded-3xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm space-y-5"
            >
                {/* 공개여부 */}
                <div className="md:w-56">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        공개 여부
                    </label>
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
                    <p className="mt-1 text-[11px] text-gray-500">
                        비공개 시 본인/관리자만 열람.
                    </p>
                </div>

                {/* 제목 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        제목
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="예) 회원정보 수정은 어디에서 하나요?"
                        className={`w-full rounded-xl border text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 ${
                            errors.title ? "border-rose-300" : "border-gray-200"
                        }`}
                        maxLength={120}
                    />
                    <div className="mt-1 flex items-center justify-between">
                        {errors.title ? (
                            <p className="text-xs text-rose-600">{errors.title}</p>
                        ) : (
                            <span className="text-xs text-gray-500">2~120자</span>
                        )}
                        <span className="text-[11px] text-gray-400">{title.length}/120</span>
                    </div>
                </div>

                {/* 내용 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        내용
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="상세한 상황/재현 방법/기대 동작 등을 적어주세요."
                        className={`w-full min-h-[200px] rounded-xl border text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 resize-y ${
                            errors.content ? "border-rose-300" : "border-gray-200"
                        }`}
                    />
                    {errors.content ? (
                        <p className="mt-1 text-xs text-rose-600">{errors.content}</p>
                    ) : (
                        <p className="mt-1 text-xs text-gray-500">10자 이상 입력</p>
                    )}
                </div>

                {/* 🔻 로그인 필요 배너 제거 (테스트 모드) */}

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
