import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../member/axiosInterceptor.js";


/**
 * FaQ 리스트
 * - 엔드포인트: POST /boards/faq/list
 * - 요청 바디: { cond: { keyword?: string }, criteria: { page: number, size: number } }
 * - 응답 예: { items: [{ id, title, content, isPublic, postStatus, regDate, boardCategoryId }...], totalElements, totalPages }
 *
 * props
 * - pageSizeOptions?: number[]     // 페이지 사이즈 옵션
 * - defaultPageSize?: number       // 초기 페이지 사이즈
 * - keywordPlaceholder?: string    // 검색 placeholder
 * - mockItems?: array              // 주입 시 API 호출 대신 목 데이터 사용
 * - adminMode?: boolean            // true면 목록에 수정/삭제 버튼 표기
 * - className?: string             // 외부 스타일 확장
 */
export default function FaqList({
                                    pageSizeOptions = [5, 10, 20],
                                    defaultPageSize = 10,
                                    keywordPlaceholder = "FAQ 검색 (예: 로그인, 비밀번호, 오류...)",
                                    mockItems,
                                    adminMode = false,
                                    className = "",
                                }) {
    const nav = useNavigate();

    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1); // 1-base
    const [size, setSize] = useState(defaultPageSize);
    const [keyword, setKeyword] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const canPrev = useMemo(() => page > 1, [page]);
    const canNext = useMemo(() => page < totalPages, [page, totalPages]);

    const fetchFaq = async () => {
        if (mockItems) {
            // ===== 목 데이터 모드 =====
            setPending(true);
            setError("");
            try {
                const filtered = keyword
                    ? mockItems.filter(
                        (it) =>
                            (it.title || "").includes(keyword) ||
                            (it.content || "").includes(keyword)
                    )
                    : mockItems;

                const start = (page - 1) * size;
                const paged = filtered.slice(start, start + size);
                setItems(paged);
                setTotalElements(filtered.length);
                setTotalPages(Math.max(1, Math.ceil(filtered.length / size)));
            } catch (e) {
                setError("목 데이터 처리 중 오류가 발생했습니다.");
            } finally {
                setPending(false);
            }
            return;
        }

        // ===== 실 API 호출 모드 =====
        setPending(true);
        setError("");
        try {
            const body = {
                cond: {
                    // categoryId=3은 서비스에서 고정 필터이므로 전달 불필요
                    keyword: keyword?.trim() || null,
                },
                criteria: {page, size},
            };
            const res = await api.post(`/boards/faq/list`, body);
            const data = res?.data || {};
            setItems(data.items || []);
            setTotalElements(
                typeof data.totalElements === "number"
                    ? data.totalElements
                    : (data.items || []).length
            );
            setTotalPages(typeof data.totalPages === "number" ? data.totalPages : 1);
        } catch (e) {
            console.error("FAQ 목록 조회 실패:", e);
            setError("FAQ 목록을 가져오지 못했습니다.");
        } finally {
            setPending(false);
        }
    };

    useEffect(() => {
        fetchFaq();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, size]); // keyword는 검색 버튼으로 트리거

    const fmtDate = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return "";
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    return (
        <div className={`w-full ${className}`}>
            {/* 헤더: 검색/사이즈 */}
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-2">
                    <input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder={keywordPlaceholder}
                        className="w-72 rounded-lg border border-[var(--border-soft)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                    />
                    <button
                        onClick={() => {
                            setPage(1);
                            fetchFaq();
                        }}
                        className="rounded-xl bg-grad-main px-4 py-2 text-white cursor-pointer transition hover:brightness-105 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                    >
                        검색
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">표시 개수</span>
                    <select
                        value={size}
                        onChange={(e) => {
                            setPage(1);
                            setSize(Number(e.target.value));
                        }}
                        className="rounded-lg border border-[var(--border-soft)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                    >
                        {pageSizeOptions.map((n) => (
                            <option key={n} value={n}>
                                {n}개
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() => nav("/faq/register")}
                        className="rounded-xl bg-grad-main px-4 py-2 text-white transition hover:brightness-105 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                    >
                        등록
                    </button>
                </div>
            </div>

            {/* 리스트 카드 */}
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
                {pending && (
                    <div className="py-10 text-center text-gray-500">불러오는 중...</div>
                )}

                {!pending && error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
                        {error}
                    </div>
                )}

                {!pending && !error && items?.length === 0 && (
                    <div className="py-10 text-center text-gray-500">
                        표시할 FAQ가 없습니다.
                    </div>
                )}

                {!pending && !error && items?.length > 0 && (
                    <ul className="divide-y">
                        {items.map((it) => (
                            <li key={it.id} className="py-3">
                                <div className="flex items-start justify-between gap-4">
                                    {/* ✅ 클릭 영역을 Link로 교체 */}
                                    <Link
                                        to={`/faq/read/${it.id}`}
                                        className="flex-1 block"
                                    >
                                        <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
                                            {it.title}
                                        </h3>
                                        {it.content && (
                                            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                                                {it.content}
                                            </p>
                                        )}
                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                        <span className="rounded-md border px-2 py-0.5">
                                          공개:{String(it.isPublic ?? true)}
                                        </span>
                                            {it.postStatus && (
                                                <span className="rounded-md border px-2 py-0.5">
                                            {it.postStatus}
                                          </span>
                                            )}
                                            {it.regDate && (
                                                <span className="rounded-md border px-2 py-0.5">
                                            {fmtDate(it.regDate)}
                                          </span>
                                            )}
                                        </div>
                                    </Link>

                                    {/* 액션 버튼 (관리자/에디터 모드 시 노출) */}
                                    {adminMode && (
                                        <div className="shrink-0 flex gap-2">
                                            <button
                                                onClick={() => nav(`/faq/modify/${it.id}`)}
                                                className="rounded-lg border px-3 py-1 text-sm cursor-pointer hover:bg-gray-50"
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={() => nav(`/faq/delete/${it.id}`)}
                                                className="rounded-lg border px-3 py-1 text-sm cursor-pointer hover:bg-gray-50"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {/* 페이지네이션 */}
            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    총 {totalElements}건 / {page} / {totalPages}
                </div>
                <div className="flex gap-2">
                    <button
                        disabled={!canPrev}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="rounded-xl border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        이전
                    </button>
                    <button
                        disabled={!canNext}
                        onClick={() => setPage((p) => p + 1)}
                        className="rounded-xl border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
}