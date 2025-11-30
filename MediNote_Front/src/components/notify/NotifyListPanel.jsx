import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../common/api/axiosInterceptor.js";
import { useAuthStore } from "@/components/common/hooks/useAuthStore.jsx";

/**
 * NotifyListPanel - 공지사항 게시판 목록 컴포넌트
 *
 * props
 * - initialKeyword?: string
 * - pageSizeOptions?: number[]      (기본: [5, 10, 20])
 * - defaultSize?: number            (기본: 10)
 * - showWriteButton?: boolean       (기본: true)
 * - onWrite?: () => void            (기본: /notice/write 로 이동)
 * - onRead?: (id: number) => void   (기본: /notice/read/:id 로 이동)
 * - adminMode?: boolean             (관리자 수정/삭제 버튼 노출 여부)
 */
export default function NotifyListPanel({
                                            initialKeyword = "",
                                            pageSizeOptions = [5, 10, 20],
                                            defaultSize = 10,
                                            showWriteButton = true,
                                            onWrite,
                                            onRead,
                                            adminMode = false,
                                        }) {
    const navigate = useNavigate();

    const { member, loading: authLoading, fetchMember } = useAuthStore();

    // // 멤버 정보 없으면 한번 가져오기(선택)
    // useEffect(() => {
    //     if (!member && !authLoading && fetchMember) {
    //             fetchMember();
    //             }
    //         }, [member, authLoading, fetchMember]);

    const isAdmin = member?.role === "ADMIN";

    // 상태
    const [keyword, setKeyword] = useState(initialKeyword);
    const [size, setSize] = useState(defaultSize);
    const [page, setPage] = useState(1);

    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const totalPages = useMemo(() => Math.max(1, Math.ceil(total / size)), [total, size]);

    // 기본 네비게이션
    const goWrite = () => {
        if (!isAdmin) {
            alert("관리자만 공지를 등록할 수 있습니다.");
            return;
            }
        return onWrite ? onWrite() : navigate("/boards/notice/write");
        };
    const goRead = (id) => (onRead ? onRead(id) : navigate(`/boards/notice/read/${id}`));

    // 날짜 포맷
    const fmtDate = (iso) => {
        if (!iso) return "-";
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return "-";
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
            d.getDate()
        ).padStart(2, "0")}`;
    };

    // 데이터 조회
    const fetchData = async (nextPage = 1) => {
        setLoading(true);
        setError("");
        try {
            const body = {
                cond: {
                    keyword: keyword?.trim() || null,
                },
                criteria: { page: nextPage, size },
            };
            const res = await api.post("/boards/notice/list", body);
            setItems(res.data?.items || []);
            setTotal(res.data?.page?.totalElements ?? res.data?.totalElements ?? 0);
            setPage(nextPage);
        } catch (e) {
            console.error("공지사항 목록 조회 실패:", e);
            setError("공지사항을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size]);

    const onSubmit = (e) => {
        e.preventDefault();
        fetchData(1);
    };

    return (
        <section className="w-full max-w-5xl mx-auto">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">공지사항</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        메디노트의 새로운 소식과 업데이트를 확인하세요.
                    </p>
                </div>
                {showWriteButton && isAdmin && (
                    <button
                        onClick={goWrite}
                        className="rounded-2xl px-4 py-2 shadow-sm text-white bg-gradient-to-r from-pink-300 to-purple-300 hover:opacity-90 transition"
                    >
                        공지 등록
                    </button>
                )}
            </div>

            {/* 검색/필터 */}
            <div className="rounded-3xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm mb-6">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <div className="ms-auto" />

                    <select
                        className="rounded-xl border-gray-200 text-sm"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                    >
                        {pageSizeOptions.map((n) => (
                            <option key={n} value={n}>
                                {n}개씩
                            </option>
                        ))}
                    </select>

                    <form onSubmit={onSubmit} className="flex items-stretch gap-2">
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="공지 검색 (예: 업데이트, 이벤트, 점검)"
                            className="rounded-xl border border-gray-200 text-sm px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                        <button
                            type="submit"
                            className="rounded-2xl px-4 py-2 text-sm text-white bg-gradient-to-r from-pink-300 to-purple-300 hover:opacity-90 transition"
                        >
                            검색
                        </button>
                    </form>
                </div>
            </div>

            {/* 리스트 */}
            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 gap-2 px-4 md:px-6 py-3 text-xs md:text-sm text-gray-500 bg-gray-50">
                    <div className="col-span-9 md:col-span-9">제목</div>
                    <div className="hidden md:block md:col-span-3 text-center">작성일</div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">불러오는 중…</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : items.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">등록된 공지사항이 없습니다.</div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {items.map((notice) => (
                            <li key={notice.id} className="grid grid-cols-12 gap-2 px-4 md:px-6 py-4">
                                <div className="col-span-12 md:col-span-9">
                                    <button
                                        onClick={() => goRead(notice.id)}
                                        className="text-left text-gray-900 hover:underline"
                                        title={notice.title}
                                    >
                                        <span className="font-medium">{notice.title}</span>
                                    </button>
                                    {/* 모바일 전용 작성일 표시 */}
                                    <div className="mt-1 md:hidden text-xs text-gray-500">
                                        {fmtDate(notice.regDate)}
                                    </div>
                                </div>

                                <div className="hidden md:flex md:col-span-3 items-center justify-center text-sm text-gray-600">
                                    {fmtDate(notice.regDate)}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* 페이지네이션 */}
                <div className="flex items-center justify-center gap-1 p-4">
                    <button
                        onClick={() => page > 1 && fetchData(page - 1)}
                        className="px-3 py-1.5 text-sm rounded-lg ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40"
                        disabled={page <= 1}
                    >
                        이전
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => fetchData(p)}
                            className={
                                "px-3 py-1.5 text-sm rounded-lg ring-1 " +
                                (p === page
                                    ? "bg-gray-900 text-white ring-gray-900"
                                    : "ring-gray-200 hover:bg-gray-50")
                            }
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => page < totalPages && fetchData(page + 1)}
                        className="px-3 py-1.5 text-sm rounded-lg ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40"
                        disabled={page >= totalPages}
                    >
                        다음
                    </button>
                </div>
            </div>
        </section>
    );
}
