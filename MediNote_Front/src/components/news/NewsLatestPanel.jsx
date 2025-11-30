// src/components/news/NewsLatestPanel.jsx
import React, { useEffect, useState } from "react";
import api from "@/components/common/api/axiosInterceptor.js";

export default function NewsLatestPanel({
                                            title = "최신 뉴스",
                                            limit = 10,               // 화면에 보여줄 최대 개수
                                            className = "",           // 부모 컨테이너에서 전달할 추가 클래스
                                        }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const formatDateTime = (iso) => {
        if (!iso) return "-";
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const goOrigin = (link) => {
        if (!link) return;
        window.open(link, "_blank", "noopener,noreferrer");
    };

    useEffect(() => {
        let cancelled = false;
        const fetchLatest = async () => {
            setLoading(true);
            setErrorMsg("");
            try {
                // axiosInterceptor의 baseURL=/api 라는 가정 하에 다음과 같이 호출
                // (질문에서 제시한 풀 URL과 동일한 엔드포인트)
                const res = await api.get("/news/latest");
                if (cancelled) return;

                const arr = Array.isArray(res.data) ? res.data : [];
                // pubDate desc 정렬 보장 (서버 정렬이 깨져도 안전)
                const sorted = [...arr].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
                setItems(sorted.slice(0, limit));
            } catch (e) {
                console.error("뉴스 최신 목록 조회 실패:", e);
                setErrorMsg("목록을 불러오지 못했습니다.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchLatest();
        return () => { cancelled = true; };
    }, [limit]);

    return (
        <section className={`w-full ${className}`}>
            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {/* 헤더 */}
                <div className="flex items-center justify-between px-5 py-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                        <p className="text-xs text-gray-500 mt-0.5">제목을 클릭하면 원문으로 이동합니다</p>
                    </div>
                </div>

                {/* 바디 */}
                {loading ? (
                    <div className="p-8 text-center text-gray-500">불러오는 중…</div>
                ) : errorMsg ? (
                    <div className="p-8 text-center text-red-500">{errorMsg}</div>
                ) : items.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">표시할 항목이 없습니다.</div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {items.map((it) => (
                            <li key={it.id} className="grid grid-cols-12 gap-2 px-5 py-3">
                                {/* 제목 */}
                                <div className="col-span-12 md:col-span-8">
                                    <button
                                        onClick={() => goOrigin(it.link)}
                                        className="text-left text-gray-900 hover:underline"
                                        title={it.title}
                                    >
                                        <span className="font-medium line-clamp-2">{it.title}</span>
                                    </button>

                                    {/* 모바일에서 메타 간단 표시 */}
                                    <div className="mt-1 md:hidden text-xs text-gray-500">
                                        {it.sourceName ?? "-"} · {formatDateTime(it.pubDate)}
                                    </div>
                                </div>

                                {/* 소스명 */}
                                <div className="hidden md:flex md:col-span-2 items-center justify-center">
                                    <span className="text-sm text-gray-600 truncate">{it.sourceName ?? "-"}</span>
                                </div>

                                {/* 발행일 */}
                                <div className="col-span-12 md:col-span-2 flex md:block items-center justify-between md:justify-center">
                                    <span className="text-xs md:text-sm text-gray-700">{formatDateTime(it.pubDate)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
