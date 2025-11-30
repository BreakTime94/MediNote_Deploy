// src/components/reply/QnAReplyPanel.jsx
import React, { useEffect, useState } from "react";
import api from "../common/api/axiosInterceptor.js";
import { useAuthStore } from "@/components/common/hooks/useAuthStore.jsx";

export default function QnAReplyPanel({ linkId, onAnswerComplete }) {
    const { member } = useAuthStore();
    const [replies, setReplies] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [memberMap, setMemberMap] = useState({}); // 닉네임 → ID 매핑용

    const isAdmin = member?.role === "ADMIN";
    const pageSize = 20;

    // ✅ 회원 목록 불러오기
    const fetchMemberMap = async () => {
        try {
            const res = await api.get("/member/list/info");
            const list = res.data?.memberInfoList ?? [];
            const map = {};
            list.forEach((m) => (map[m.nickname] = m.id));
            setMemberMap(map);
        } catch (e) {
            console.error("회원 목록 불러오기 실패:", e);
        }
    };

    // ✅ 댓글 목록 불러오기
    const fetchReplies = async () => {
        if (!linkId) return;
        setLoading(true);
        try {
            const res = await api.post(`/replies/list/BOARD/${linkId}`, {
                page: 1,
                size: pageSize,
            });
            setReplies(res.data?.content ?? []);
        } catch (e) {
            console.error("댓글 목록 조회 실패:", e);
            setError("댓글을 불러올 수 없습니다.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ 댓글 등록
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            alert("내용을 입력하세요.");
            return;
        }

        const memberId = memberMap[member?.nickname];
        if (!memberId) {
            alert("회원 ID를 찾을 수 없습니다. 다시 로그인 후 시도해주세요.");
            return;
        }

        setSubmitting(true);
        try {
            const dto = {
                memberId,
                linkId,
                linkType: "BOARD",
                content: content.trim(),
                isPublic: true,
                title: "관리자 답변",
            };

            await api.post("/replies/create", dto);

            // 목록 새로고침
            await fetchReplies();
            setContent("");

            // ✅ QnA 상태를 ANSWERED 로 업데이트
            if (onAnswerComplete) {
                onAnswerComplete("ANSWERED");
            } else {
                await api.put(`/boards/qna/status/${linkId}`, {
                    qnaStatus: "ANSWERED",
                });
            }

            alert("답변이 등록되었습니다.");
        } catch (e) {
            console.error("댓글 등록 실패:", e);
            alert("댓글 등록 중 오류가 발생했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    // ✅ 댓글 삭제
    const handleDelete = async (replyId) => {
        if (!confirm("이 댓글을 삭제하시겠습니까?")) return;
        try {
            await api.delete(`/replies/delete/${replyId}`);
            await fetchReplies();
        } catch (e) {
            console.error("댓글 삭제 실패:", e);
            alert("댓글 삭제 중 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        fetchMemberMap();
    }, []);

    useEffect(() => {
        fetchReplies();
    }, [linkId]);

    return (
        <div className="mt-10 rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">답변 / 댓글</h3>
            </div>

            <div className="p-5 space-y-6">
                {isAdmin && (
                    <form onSubmit={handleSubmit} className="space-y-3">
    <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="답변 내용을 입력하세요."
        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 min-h-[100px]"
    />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-pink-300 to-purple-300 hover:opacity-90 disabled:opacity-60"
                            >
                                {submitting ? "등록 중…" : "답변 등록"}
                            </button>
                        </div>
                    </form>
                )}

                {loading ? (
                    <p className="text-sm text-gray-400">댓글을 불러오는 중...</p>
                ) : error ? (
                    <p className="text-sm text-rose-600">{error}</p>
                ) : replies.length === 0 ? (
                    <p className="text-sm text-gray-400">등록된 답변이 없습니다.</p>
                ) : (
                    <ul className="space-y-4">
                        {replies.map((r) => (
                            <li
                                key={r.id}
                                className="p-4 rounded-2xl border border-gray-100 bg-gray-50"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {r.memberNickname ?? "익명"}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(r.regDate).toLocaleString()}
                                        </span>
                                    </div>
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(r.id)}
                                            className="text-xs text-rose-500 hover:text-rose-700"
                                        >
                                            삭제
                                        </button>
                                    )}
                                </div>
                                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                    {r.content}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
