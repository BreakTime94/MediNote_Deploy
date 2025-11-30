import React, { useEffect, useMemo, useState } from "react";
import api from "../common/api/axiosInterceptor.js";

export default function NewsListPanel({
                                          mode = "news",
                                          searchType = "NEWS",
                                          title = "뉴스",
                                          pageSizeOptions = [5, 10, 20],
                                          defaultSize = 10,
                                          className = "",
                                          asideSectionIds = { latest: "latest", search: "search-result" },
                                      }) {
    const [keyword, setKeyword] = useState("");
    const [size, setSize] = useState(defaultSize);
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);

    const sort = "pubDate,desc";

    const listPath = useMemo(() => {
        if (mode === "columns") return "/news/list/columns";
        if (mode === "health-info") return "/news/list/health-info";
        return "/news/list/news";
    }, [mode]);

    const formatDateTime = (iso) => {
        if (!iso) return "-";
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const fetchList = async (nextPage1Base = 1) => {
        setLoading(true);
        try {
            const params = { page: nextPage1Base - 1, size, sort };
            let url = listPath;
            if (keyword.trim().length > 0) url = "/news/search-title";

            const res = await api.get(url, {
                params:
                    url === "/news/search-title"
                        ? { keyword: keyword.trim(), type: searchType, ...params }
                        : params,
            });

            const data = res.data || {};
            const content = data.content ?? [];
            setItems(
                content.map((n) => ({
                    id: n.id,
                    title: n.title,
                    link: n.link, // ✅ 여기 링크 그대로 사용
                    sourceName: n.sourceName,
                    contentType: n.contentType,
                    pubDate: n.pubDate,
                }))
            );
            setTotalPages(data.totalPages ?? 1);
            setTotalElements(data.totalElements ?? content.length);
            setPage(nextPage1Base);
        } catch (e) {
            console.error("뉴스 목록 조회 실패:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchList(1);
    }, [size, mode, searchType]);

    const onSubmit = (e) => {
        e.preventDefault();
        fetchList(1);
        if (asideSectionIds?.search) {
            const el = document.getElementById(asideSectionIds.search);
            if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: "smooth" });
            }
        }
    };

    // ✅ 변경된 부분
    const goOrigin = (link) => {
        if (!link) return;
        window.open(link, "_blank", "noopener,noreferrer");
    };

    const headerSubtitle = useMemo(() => {
        if (searchType === "COLUMN") return "칼럼 최신 소식";
        if (searchType === "HEALTH_INFO") return "건강정보 최신 소식";
        return "뉴스 최신 소식";
    }, [searchType]);

    return (
        <section className={`w-full max-w-5xl mx-auto ${className}`}>
            <div id={asideSectionIds?.latest || "latest"} className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
                        <p className="text-sm text-gray-500 mt-1">{headerSubtitle}</p>
                    </div>
                </div>

                {/* 검색/필터 ... (생략) */}

                <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    {/* 리스트 헤더 ... */}

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">불러오는 중…</div>
                    ) : items.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">표시할 항목이 없습니다.</div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {items.map((it) => (
                                <li key={it.id} className="grid grid-cols-12 gap-2 px-4 md:px-6 py-4">
                                    <div className="col-span-12 md:col-span-7">
                                        {/* ✅ 링크 직접 열기 */}
                                        <button
                                            onClick={() => goOrigin(it.link)}
                                            className="text-left text-gray-900 hover:underline"
                                            title={it.title}
                                        >
                                            <span className="font-medium">{it.title}</span>
                                        </button>

                                        <div className="mt-2 md:hidden text-xs text-gray-500">
                                            {it.sourceName ?? "-"} · {formatDateTime(it.pubDate)}
                                        </div>
                                    </div>

                                    <div className="hidden md:flex md:col-span-2 items-center justify-center text-sm text-gray-600">
                                        {it.sourceName ?? "-"}
                                    </div>

                                    <div className="col-span-5 md:col-span-3 flex items-center justify-end md:justify-center">
                                        <span className="text-sm text-gray-700">{formatDateTime(it.pubDate)}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* 페이지네이션 */}
                    <div className="flex items-center justify-center gap-1 p-4">
                        <button
                            onClick={() => page > 1 && fetchList(page - 1)}
                            className="px-3 py-1.5 text-sm rounded-lg ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40"
                            disabled={page <= 1 || loading}
                        >
                            이전
                        </button>

                        {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => fetchList(p)}
                                className={
                                    "px-3 py-1.5 text-sm rounded-lg ring-1 " +
                                    (p === page ? "bg-gray-900 text-white ring-gray-900" : "ring-gray-200 hover:bg-gray-50")
                                }
                                disabled={loading}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            onClick={() => page < totalPages && fetchList(page + 1)}
                            className="px-3 py-1.5 text-sm rounded-lg ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40"
                            disabled={page >= totalPages || loading}
                        >
                            다음
                        </button>
                    </div>

                    {/* 총 건수 */}
                    <div className="px-4 md:px-6 pb-4 text-xs text-gray-500 text-right">
                        총 {totalElements.toLocaleString()}건
                    </div>
                </div>
            </div>
        </section>
    );
}
