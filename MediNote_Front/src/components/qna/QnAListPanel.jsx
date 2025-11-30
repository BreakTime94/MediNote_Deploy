import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../common/api/axiosInterceptor.js";

export default function QnAListPanel({
                                         initialStatus = "ALL",
                                         initialKeyword = "",
                                         pageSizeOptions = [5, 10, 20],
                                         defaultSize = 10,
                                         showWriteButton = true,
                                         onWrite,
                                         onRead,
                                     }) {
    const navigate = useNavigate();

    // 상태 정의
    const [status, setStatus] = useState(initialStatus);
    const [keyword, setKeyword] = useState(initialKeyword);
    const [size, setSize] = useState(defaultSize);
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [memberMap, setMemberMap] = useState({}); // ✅ 작성자 닉네임 매핑용

    const totalPages = useMemo(() => Math.max(1, Math.ceil(total / size)), [total, size]);

    const statusColor = (s) =>
        s === "ANSWERED"
            ? "bg-green-50 text-green-700 ring-1 ring-green-200"
            : s === "WAITING"
                ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                : "bg-gray-50 text-gray-700 ring-1 ring-gray-200";

    const goWrite = () => (onWrite ? onWrite() : navigate("/boards/qna/write"));
    const goRead = (id) => (onRead ? onRead(id) : navigate(`/boards/qna/read/${id}`));

    // ✅ 작성자 정보 불러오기
    const fetchMemberList = async () => {
        try {
            const res = await api.get("/member/list/info");
            const list = res.data?.memberInfoList || [];
            const map = {};
            list.forEach((m) => (map[m.id] = m.nickname));
            setMemberMap(map);
        } catch (e) {
            console.error("회원 목록 불러오기 실패:", e);
        }
    };

    // ✅ QnA 목록 불러오기
    const fetchData = async (nextPage = 1) => {
        setLoading(true);
        try {
            const body = {
                cond: {
                    keyword: keyword?.trim() || null,
                    qnaStatus: status === "ALL" ? null : status,
                },
                criteria: { page: nextPage, size },
            };
            const res = await api.post("/boards/qna/list", body);
            setItems(res.data?.items || []);
            setTotal(res.data?.page?.totalElements ?? 0);
            setPage(nextPage);
        } catch (e) {
            console.error("QnA 목록 조회 실패:", e);
        } finally {
            setLoading(false);
        }
    };

    // ✅ 초기 데이터 로드
    useEffect(() => {
        fetchMemberList(); // 작성자 목록
        fetchData(1); // QnA 목록
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, size]);

    const onSubmit = (e) => {
        e.preventDefault();
        fetchData(1);
    };

    return (
        <section className="w-full max-w-5xl mx-auto">
            {/* 헤더줄 */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">QnA</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        궁금한 점을 검색하거나 질문을 남겨보세요.
                    </p>
                </div>
                {showWriteButton && (
                    <button
                        onClick={goWrite}
                        className="rounded-2xl px-4 py-2 shadow-sm text-white bg-gradient-to-r from-pink-300 to-purple-300 hover:opacity-90 transition"
                    >
                        질문하기
                    </button>
                )}
            </div>

            {/* 검색/필터 */}
            <div className="rounded-3xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm mb-6">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    {["ALL", "WAITING", "ANSWERED"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setStatus(tab)}
                            className={
                                "px-3 py-1.5 rounded-xl text-sm ring-1 transition " +
                                (status === tab
                                    ? "bg-gradient-to-r from-pink-200 to-purple-200 text-gray-900 ring-transparent"
                                    : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50")
                            }
                        >
                            {tab === "ALL" ? "전체" : tab === "WAITING" ? "답변대기" : "답변완료"}
                        </button>
                    ))}

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
                            placeholder="제목/내용/작성자 검색"
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
                {/* 헤더 */}
                <div className="grid grid-cols-12 gap-2 px-4 md:px-6 py-3 text-xs md:text-sm text-gray-500 bg-gray-50">
                    <div className="col-span-6 md:col-span-6">제목</div>
                    <div className="hidden md:block md:col-span-2 text-center">작성자</div> {/* ✅ 추가 */}
                    <div className="hidden md:block md:col-span-2 text-center">작성일</div>
                    <div className="col-span-4 md:col-span-2 text-center">상태</div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">불러오는 중…</div>
                ) : items.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">표시할 항목이 없습니다.</div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {items.map((qna) => (
                            <li key={qna.id} className="grid grid-cols-12 gap-2 px-4 md:px-6 py-4">
                                {/* 제목 */}
                                <div className="col-span-12 md:col-span-6">
                                    <button
                                        onClick={() => goRead(qna.id)}
                                        className="text-left text-gray-900 hover:underline"
                                        title={qna.title}
                                    >
                                        <span className="font-medium">{qna.title}</span>
                                    </button>
                                </div>

                                {/* ✅ 작성자 표시 */}
                                <div className="hidden md:flex md:col-span-2 items-center justify-center text-sm text-gray-700">
                                    {memberMap[qna.memberId] ?? "-"}
                                </div>

                                {/* 작성일 */}
                                <div className="hidden md:flex md:col-span-2 items-center justify-center text-sm text-gray-600">
                                    {qna.regDate?.slice(0, 10) ?? "-"}
                                </div>

                                {/* 상태 */}
                                <div className="col-span-12 md:col-span-2 flex items-center justify-center">
                  <span
                      className={`px-2.5 py-1 rounded-full text-xs ${statusColor(qna.qnaStatus)}`}
                  >
                    {qna.qnaStatus === "ANSWERED"
                        ? "답변완료"
                        : qna.qnaStatus === "WAITING"
                            ? "답변대기"
                            : qna.qnaStatus}
                  </span>
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
