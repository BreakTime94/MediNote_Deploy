// src/components/faq/FaQReadPanel.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../common/api/axiosInterceptor.js";
import { useAuthStore } from "@/components/common/hooks/useAuthStore.jsx";

export default function FaQReadPanel({
                                         onBack,
                                         showAdminActions = true,
                                         listPath = "/boards/faq",
                                     }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { member } = useAuthStore();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveErr, setSaveErr] = useState("");
    const [deleting, setDeleting] = useState(false);

    // ✅ React 18 StrictMode 중복 호출 가드
    const fetchedRef = useRef(false);

    // ✅ ADMIN 판별(여러 형태 대비)
    const isAdmin = useMemo(() => {
        const raw = ((member?.role || member?.memberRole || member?.roleName) ?? "") + "";
        const rolesArr = Array.isArray(member?.roles) ? member.roles : [];
        const authArr = Array.isArray(member?.authorities) ? member.authorities : [];
        if (raw.toUpperCase() === "ADMIN") return true;
        if (rolesArr.map((r) => (r + "").toUpperCase()).includes("ADMIN")) return true;
        if (
            authArr.some((a) =>
                typeof a === "string"
                    ? a.toUpperCase().includes("ADMIN")
                    : (a?.authority + "").toUpperCase().includes("ADMIN")
            )
        )
            return true;
        return false;
    }, [member]);

    // 공개/비공개 배지
    const publicBadge = useMemo(() => {
        if (data?.isPublic === false) return "bg-gray-50 text-gray-700 ring-1 ring-gray-200";
        return "bg-green-50 text-green-700 ring-1 ring-green-200";
    }, [data]);

    const fmtDate = (iso) => {
        if (!iso) return "-";
        try {
            const d = new Date(iso);
            if (!isNaN(d.getTime())) {
                const pad = (n) => String(n).padStart(2, "0");
                return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
            }
        } catch (_) {}
        return String(iso).slice(0, 16).replace("T", " ");
    };

    const goBack = () => (onBack ? onBack() : navigate(listPath));

    const fetchDetail = async (signal) => {
        setErr("");
        setLoading(true);
        try {
            const res = await api.get(`/boards/read/${id}`, { signal });
            const next = res.data || null;
            setData(next);
            setTitle(next?.title ?? "");
            setContent(next?.content ?? "");
        } catch (e) {
            if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return;
            console.error(e);
            setErr("FAQ를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // StrictMode로 인한 이펙트 2회 실행 방지
        if (fetchedRef.current) {
            fetchedRef.current = false; // id 변경 시 다음 렌더에 다시 허용
            return;
        }
        fetchedRef.current = true;

        const controller = new AbortController();
        fetchDetail(controller.signal);

        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // ===== 수정 =====
    const handleEditToggle = () => {
        if (!isAdmin) return;
        setSaveErr("");
        setEditMode((v) => !v);
        if (data) {
            setTitle(data.title ?? "");
            setContent(data.content ?? "");
        }
    };

    const handleSave = async () => {
        if (!isAdmin) return;
        setSaveErr("");
        if (!title?.trim() || title.trim().length < 2) {
            setSaveErr("제목은 2자 이상 입력하세요.");
            return;
        }
        if (!content?.trim() || content.trim().length < 10) {
            setSaveErr("내용은 10자 이상 입력하세요.");
            return;
        }

        setSaving(true);
        try {
            const dto = {
                id: Number(id),
                boardCategoryId: data?.boardCategoryId ?? 3, // FAQ 카테고리
                title: title.trim(),
                content: content.trim(),
                isPublic: data?.isPublic ?? true,
                requireAdminPost: data?.requireAdminPost ?? false,
                qnaStatus: data?.qnaStatus ?? "WAITING",
                postStatus: data?.postStatus ?? "PUBLISHED",
            };
            await api.put(`/boards/update/${id}`, dto);
            await fetchDetail(); // 최신 반영
            setEditMode(false);
        } catch (e) {
            console.error("PUT /boards/update error:", {
                status: e?.response?.status,
                data: e?.response?.data,
                message: e?.message,
            });
            setSaveErr(
                e?.response?.data?.message ??
                e?.response?.data?.error ??
                "수정에 실패했습니다. 잠시 후 다시 시도하세요."
            );
        } finally {
            setSaving(false);
        }
    };

    // ===== 삭제 =====
    const handleDelete = async () => {
        if (!isAdmin) return;
        if (!confirm("정말 삭제하시겠습니까? (소프트 삭제)")) return;
        setDeleting(true);
        try {
            const requesterId = member?.id ?? member?.memberId ?? 0;
            await api.delete(`/boards/delete/${id}`, {
                data: { requesterId, reason: "FAQ 삭제" },
            });
            alert("삭제되었습니다.");
            goBack();
        } catch (e) {
            console.error(e);
            alert("삭제에 실패했습니다.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <section className="w-full max-w-5xl mx-auto">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">FAQ</h2>
                    <p className="text-sm text-gray-500 mt-1">자주 묻는 질문 상세</p>
                </div>

                <div className="flex items-center gap-2">
                    {/* 목록: 항상 노출 */}
                    <button
                        onClick={goBack}
                        className="rounded-2xl px-4 py-2 shadow-sm ring-1 ring-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition"
                    >
                        목록
                    </button>

                    {/* 관리자에게만 수정/저장/취소 */}
                    {isAdmin && (
                        <>
                            {!editMode ? (
                                <button
                                    onClick={handleEditToggle}
                                    className="rounded-2xl px-4 py-2 shadow-sm text-white bg-gradient-to-r from-pink-300 to-purple-300 hover:opacity-90 transition"
                                >
                                    수정
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="rounded-2xl px-4 py-2 shadow-sm text-white bg-gradient-to-r from-pink-300 to-purple-300 hover:opacity-90 transition disabled:opacity-60"
                                    >
                                        {saving ? "저장 중…" : "저장"}
                                    </button>
                                    <button
                                        onClick={handleEditToggle}
                                        disabled={saving}
                                        className="rounded-2xl px-4 py-2 shadow-sm ring-1 ring-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
                                    >
                                        취소
                                    </button>
                                </>
                            )}
                        </>
                    )}

                    {/* 관리자 + showAdminActions 일 때만 삭제 */}
                    {showAdminActions && isAdmin && (
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="rounded-2xl px-4 py-2 shadow-sm ring-1 ring-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition disabled:opacity-60"
                        >
                            {deleting ? "삭제 중…" : "삭제"}
                        </button>
                    )}
                </div>
            </div>

            {/* 본문 카드 */}
            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {/* 제목줄 */}
                <div className="px-5 md:px-6 py-5 border-b border-gray-100">
                    {loading ? (
                        <div className="h-6 w-2/3 bg-gray-100 rounded animate-pulse" />
                    ) : err ? (
                        <p className="text-sm text-rose-600">{err}</p>
                    ) : (
                        <>
                            {!editMode ? (
                                <h1 className="text-xl md:text-2xl font-semibold text-gray-900 break-words">
                                    {data?.title}
                                </h1>
                            ) : isAdmin ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">제목</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full rounded-xl border text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 border-gray-200"
                                        maxLength={160}
                                    />
                                </div>
                            ) : null}

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className={`px-2.5 py-1 rounded-full text-xs ${publicBadge}`}>
                  {data?.isPublic === false ? "비공개" : "공개"}
                </span>

                                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-50 ring-1 ring-gray-200 text-gray-600">
                  FAQ
                </span>

                                <span className="text-gray-400">•</span>
                                <span className="text-gray-600">등록 {fmtDate(data?.regDate)}</span>
                                {data?.modDate && (
                                    <>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-600">수정 {fmtDate(data?.modDate)}</span>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* 내용 */}
                <div className="px-5 md:px-6 py-6">
                    {loading ? (
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-100 rounded animate-pulse" />
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-11/12" />
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-10/12" />
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-9/12" />
                        </div>
                    ) : err ? (
                        <p className="text-sm text-rose-600">{err}</p>
                    ) : !editMode ? (
                        <article className="prose prose-sm md:prose-base max-w-none text-gray-900 whitespace-pre-wrap break-words">
                            {data?.content}
                        </article>
                    ) : isAdmin ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">내용</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full min-h-[220px] rounded-xl border text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 resize-y border-gray-200"
                                placeholder="수정할 내용을 입력하세요."
                            />
                            {saveErr && <p className="mt-2 text-sm text-rose-600">{saveErr}</p>}
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
