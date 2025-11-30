import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// 배포 시 재사용할 인터셉터(나중에 게이트웨이 복귀 시 사용)
import api from "../../member/axiosInterceptor.js";
import axios from "axios";

export default function FaqEdit({
                                    defaultMemberId = 1,
                                }) {
    const { id } = useParams();            // URL: /faq/edit/:id
    const nav = useNavigate();

    // 폼 상태
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [requireAdminPost, setRequireAdminPost] = useState(false);
    const [postStatus, setPostStatus] = useState("PUBLISHED");

    // 공통 상태
    const [loading, setLoading] = useState(true);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const [deleteReason, setDeleteReason] = useState("");

    // ===== 초기 데이터 로딩 =====
    useEffect(() => {
        let ignore = false;
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                // ✅ 임시: 백엔드(8082)로 직접 호출
                const res = await axios.get(`http://localhost:8082/api/boards/${id}`);
                // 📌 게이트웨이 복귀 시
                // const res = await api.get(`/boards/${id}`);

                if (!ignore) {
                    const it = res.data;
                    setTitle(it.title ?? "");
                    setContent(it.content ?? "");
                    setIsPublic(!!it.isPublic);
                    setRequireAdminPost(!!it.requireAdminPost);
                    setPostStatus(it.postStatus ?? "PUBLISHED");
                }
            } catch (err) {
                console.error("FAQ 단일 조회 실패:", err);
                if (!ignore) {
                    const msg =
                        err?.response?.data?.message ||
                        err?.message ||
                        "FAQ 데이터를 불러오지 못했습니다.";
                    setError(msg);
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };
        fetchData();
        return () => (ignore = true);
    }, [id]);

    const canSubmit = title.trim() && content.trim() && !pending;

    // ===== 수정(PATCH) =====
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;

        setPending(true);
        setError("");

        try {
            // BoardUpdateRequestDTO
            const body = {
                id: Number(id),
                boardCategoryId: null,     // 카테고리 변경 없으면 null 유지(서비스에서 무시)
                title: title.trim(),
                content: content.trim(),
                isPublic,
                requireAdminPost,
                qnaStatus: null,           // 변경 없음
                postStatus,                // 상태 변경 가능
            };

            // ✅ 임시: 백엔드(8082)로 직접 호출
            await axios.patch(`http://localhost:8082/api/boards/${id}`, body, {
                headers: { "Content-Type": "application/json" },
                withCredentials: false,
            });

            // 📌 게이트웨이 복귀 시
            // await api.patch(`/boards/${id}`, body);

            // 수정 후 read로 이동
            nav(`/faq/read/${id}`);
        } catch (err) {
            console.error("FAQ 수정 실패:", err);
            const msg =
                err?.response?.data?.messages?.join(", ") ||
                err?.response?.data?.message ||
                err?.response?.statusText ||
                err?.message ||
                "FAQ 수정 중 오류가 발생했습니다.";
            setError(msg);
        } finally {
            setPending(false);
        }
    };

    // ===== 삭제(DELETE, 소프트) =====
    const handleDelete = async () => {
        if (!window.confirm("정말 삭제하시겠습니까? (소프트 삭제: 비공개 + 상태 DELETED)")) return;

        setPending(true);
        setError("");

        try {
            // BoardDeleteBody { requesterId, reason } 를 body로 전송해야 함
            const body = {
                requesterId: defaultMemberId,
                reason: deleteReason || "FAQ 삭제",
            };

            // ✅ 임시: 백엔드(8082)로 직접 호출 (axios.delete는 body 전송 시 data 키 사용)
            await axios.delete(`http://localhost:8082/api/boards/${id}`, {
                headers: { "Content-Type": "application/json" },
                data: body,
                withCredentials: false,
            });

            // 📌 게이트웨이 복귀 시
            // await api.delete(`/boards/${id}`, { data: body });

            // 삭제 후 목록으로
            nav("/faq");
        } catch (err) {
            console.error("FAQ 삭제 실패:", err);
            const msg =
                err?.response?.data?.messages?.join(", ") ||
                err?.response?.data?.message ||
                err?.response?.statusText ||
                err?.message ||
                "FAQ 삭제 중 오류가 발생했습니다.";
            setError(msg);
        } finally {
            setPending(false);
        }
    };

    // ===== 로딩 상태 UI =====
    if (loading) {
        return (
            <div className="w-full max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">FAQ 수정</h2>
                <div className="animate-pulse space-y-3">
                    <div className="h-10 rounded bg-gray-100" />
                    <div className="h-40 rounded bg-gray-100" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="h-10 rounded bg-gray-100" />
                        <div className="h-10 rounded bg-gray-100" />
                        <div className="h-10 rounded bg-gray-100" />
                    </div>
                    <div className="flex justify-end gap-2">
                        <div className="h-9 w-20 rounded bg-gray-100" />
                        <div className="h-9 w-20 rounded bg-gray-100" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">FAQ 수정</h2>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">
                    {error}
                </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
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

                {/* 삭제 사유(선택) */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">삭제 사유 (선택)</label>
                    <input
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                        placeholder="예) 중복 FAQ"
                        className="w-full rounded-lg border border-[var(--border-soft)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        삭제 시 소프트 삭제 처리됩니다. (isPublic=false, postStatus=DELETED)
                    </p>
                </div>

                {/* 액션 */}
                <div className="flex items-center justify-between gap-2 pt-2">
                    <button
                        type="button"
                        onClick={() => nav(`/faq/read/${id}`)}
                        className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                        disabled={pending}
                    >
                        취소
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                            disabled={pending}
                        >
                            삭제
                        </button>
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="rounded-xl bg-grad-main px-4 py-2 text-sm text-white transition enabled:hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {pending ? "수정 중..." : "수정"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
