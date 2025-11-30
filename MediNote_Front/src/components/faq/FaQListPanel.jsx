// src/components/faq/FaqListPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";          // ✅ Link 제거
import api from "../common/api/axiosInterceptor.js";
import { getCategoryName } from "../common/constants/boardCategory.js";
import { useAuthStore } from "@/components/common/hooks/useAuthStore.jsx"; // ✅ 추가

export default function FaqListPanel({
                                         initialKeyword = "",
                                         pageSizeOptions = [5, 10, 20],
                                         defaultSize = 10,
                                         showWriteButton = true,
                                         onWrite,
                                         onRead,
                                         adminMode = false,
                                     }) {
    const navigate = useNavigate();
    const { member, loading: authLoading, fetchMember } = useAuthStore(); // ✅ 관리자 여부 확인용

    // // // 멤버 정보 없을 시 1회 로드
    // useEffect(() => {
    //     if (!member && !authLoading && fetchMember) {
    //         fetchMember();
    //     }
    // }, [authLoading, fetchMember]);

    const isAdmin = member?.role === "ADMIN"; // ✅ 관리자 판별

    // 상태 관리
    const [keyword, setKeyword] = useState(initialKeyword);
    const [size, setSize] = useState(defaultSize);
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const totalPages = useMemo(() => Math.max(1, Math.ceil(total / size)), [total, size]);

    const goWrite = () => {
        if (!isAdmin) {
            alert("관리자만 FAQ를 등록할 수 있습니다.");
            return;
        }
        return onWrite ? onWrite() : navigate("/boards/faq/write");
    };

    const goRead = (id) => (onRead ? onRead(id) : navigate(`/boards/faq/read/${id}`));

    const fmtDate = (iso) => {
        if (!iso) return "-";
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return "-";
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
            d.getDate()
        ).padStart(2, "0")}`;
    };

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
            const res = await api.post("/boards/faq/list", body);

            const mapped = (res.data?.items || []).map((item) => ({
                ...item,
                boardCategoryName: getCategoryName(item.boardCategoryId, true),
            }));

            setItems(mapped);
            setTotal(res.data?.page?.totalElements ?? res.data?.totalElements ?? 0);
            setPage(nextPage);
        } catch (e) {
            console.error("FAQ 목록 조회 실패:", e);
            setError("FAQ 목록을 불러오지 못했습니다.");
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
                    <h2 className="text-2xl font-semibold text-gray-900">자주 묻는 질문</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        메디노트 이용 중 자주 묻는 질문을 확인하세요.
                    </p>
                </div>
                {/* ✅ 관리자만 노출 */}
                {showWriteButton && isAdmin && (
                    <button
                        onClick={goWrite}
                        className="rounded-2xl px-4 py-2 shadow-sm text-white bg-gradient-to-r from-pink-300 to-purple-300 hover:opacity-90 transition"
                    >
                        FAQ 등록
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
                            placeholder="FAQ 검색 (예: 로그인, 비밀번호, 오류...)"
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
                    <div className="col-span-10 md:col-span-10">제목</div>
                    <div className="hidden md:block md:col-span-2 text-center">작성일</div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">불러오는 중…</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : items.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">표시할 FAQ가 없습니다.</div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {items.map((faq) => (
                            <li key={faq.id} className="grid grid-cols-12 gap-2 px-4 md:px-6 py-4">
                                <div className="col-span-12 md:col-span-10">
                                    <button
                                        onClick={() => goRead(faq.id)}
                                        className="text-left text-gray-900 hover:underline"
                                        title={faq.title}
                                    >
                                        <span className="font-medium">{faq.title}</span>
                                    </button>

                                    <div className="mt-1 md:hidden text-xs text-gray-500">
                                        {fmtDate(faq.regDate)}
                                    </div>
                                </div>

                                <div className="hidden md:flex md:col-span-2 items-center justify-center text-sm text-gray-600">
                                    {fmtDate(faq.regDate)}
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
                                (p === page ? "bg-gray-900 text-white ring-gray-900" : "ring-gray-200 hover:bg-gray-50")
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
