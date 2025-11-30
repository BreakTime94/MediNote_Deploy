// src/test/stories/components/board/faq/FaqRead.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../member/axiosInterceptor.js";
import axios from "axios";

export default function FaqRead({ defaultMemberId = 1 }) {
    const { id } = useParams(); // /faq/read/:id
    const nav = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;
        (async () => {
            setLoading(true);
            setError("");
            try {
                // ✅ 임시: 백엔드(8082)로 직접 호출
                const res = await axios.get(`http://localhost:8082/api/boards/${id}`);
                // 📌 게이트웨이 복귀 시
                // const res = await api.get(`/boards/${id}`);
                if (!ignore) setItem(res.data);
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
        })();
        return () => (ignore = true);
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("정말 삭제하시겠습니까? (소프트 삭제)")) return;
        setPending(true);
        setError("");
        try {
            const body = { requesterId: defaultMemberId, reason: "FAQ 삭제" };
            // ✅ 임시: 백엔드(8082)로 직접 호출
            await axios.delete(`http://localhost:8082/api/boards/${id}`, {
                headers: { "Content-Type": "application/json" },
                data: body,
                withCredentials: false,
            });
            // 📌 게이트웨이 복귀 시
            // await api.delete(`/boards/${id}`, { data: body });
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

    const fmt = (s) => (s ? new Date(s).toLocaleString() : "-");

    if (loading) {
        return (
            <div className="w-full max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">FAQ 보기</h2>
                <div className="animate-pulse space-y-3">
                    <div className="h-8 rounded bg-gray-100" />
                    <div className="h-5 w-1/2 rounded bg-gray-100" />
                    <div className="h-40 rounded bg-gray-100" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">FAQ 보기</h2>
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">
                    {error}
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={() => nav("/faq")}
                        className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        목록
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold text-gray-900">{item?.title}</h2>
            <div className="mb-4 text-sm text-gray-500">
                <span className="mr-3">ID: {item?.id}</span>
                <span className="mr-3">카테고리: {item?.boardCategoryId}</span>
                <span className="mr-3">공개: {item?.isPublic ? "공개" : "비공개"}</span>
                <span className="mr-3">상태: {item?.postStatus}</span>
                <span>등록일: {fmt(item?.regDate)}</span>
            </div>

            <article className="prose max-w-none whitespace-pre-wrap text-[15px] text-gray-800">
                {item?.content || "-"}
            </article>

            <div className="mt-6 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => nav("/faq")}
                    className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                >
                    목록
                </button>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => nav(`/faq/modify/${id}`)}
                        className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                        disabled={pending}
                    >
                        수정
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                        disabled={pending}
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
}
