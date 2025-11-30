import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../member/axiosInterceptor.js";

export default function QnARead() {
    const { id } = useParams(); // QnA 글 ID
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    // 댓글 상태
    const [replies, setReplies] = useState([]);
    const [replyLoading, setReplyLoading] = useState(true);
    const [newReply, setNewReply] = useState("");

    // ===== 데이터 로딩 =====
    const fetchData = async () => {
        try {
            const res = await api.get(`/boards/read/${id}`);
            setItem(res.data);
        } catch (err) {
            console.error("QnA 단일 조회 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchReplies = async () => {
        try {
            const res = await api.post(`/replies/list/BOARD/${id}`, {
                page: 1,
                size: 10,
                sort: ["id,desc"],
            }, {
                headers: {
                    "X-Member-Id": 1 // 🔥 임시 고정 (로그인 연동 전)
                }
            });
            setReplies(res.data.content);
        } catch (err) {
            console.error("댓글 목록 조회 실패:", err);
        } finally {
            setReplyLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchReplies();
    }, [id]);

    // ===== 댓글 등록 =====
    const handleCreateReply = async () => {
        if (!newReply.trim()) return;
        try {
            await api.post("/replies/create", {
                memberId: 1, // 🔥 임시 고정
                linkId: id,
                linkType: "BOARD",
                content: newReply,
                isPublic: true,
            }, {
                headers: {
                    "X-Member-Id": 1 // 🔥 임시 고정
                }
            });
            setNewReply("");
            fetchReplies();
        } catch (err) {
            console.error("댓글 등록 실패:", err);
        }
    };

    // ===== 댓글 수정 =====
    const handleUpdateReply = async (replyId, content) => {
        const updated = prompt("수정할 내용을 입력하세요:", content);
        if (!updated) return;
        try {
            await api.patch(`/replies/update/${replyId}`, {
                content: updated,
                title: null,
                isPublic: true,
            }, {
                headers: {
                    "X-Member-Id": 1 // 🔥 임시 고정
                }
            });
            fetchReplies();
        } catch (err) {
            console.error("댓글 수정 실패:", err);
        }
    };

    // ===== 댓글 삭제 =====
    const handleDeleteReply = async (replyId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await api.delete(`/replies/delete/${replyId}`, {
                headers: {
                    "X-Member-Id": 1 // 🔥 임시 고정
                }
            });
            fetchReplies();
        } catch (err) {
            console.error("댓글 삭제 실패:", err);
        }
    };

    // ===== UI =====
    if (loading) return <div style={{ padding: 16 }}>불러오는 중...</div>;
    if (!item) return <div style={{ padding: 16 }}>데이터 없음</div>;

    return (
        <div style={{ padding: 16 }}>
            <h3>QnA 상세 조회</h3>
            <p><strong>ID:</strong> {item.id}</p>
            <p><strong>제목:</strong> {item.title}</p>
            <p><strong>내용:</strong> {item.content}</p>
            <p><strong>상태:</strong> {item.qnaStatus}</p>
            <p><strong>공개 여부:</strong> {item.isPublic ? "공개" : "비공개"}</p>
            <p><strong>등록일:</strong> {item.regDate}</p>

            <button onClick={() => navigate("/qna")} style={{ marginTop: 16 }}>
                목록으로
            </button>

            {/* 댓글 영역 */}
            <div style={{ marginTop: 32 }}>
                <h4>댓글 목록</h4>
                {replyLoading ? (
                    <p>댓글 불러오는 중...</p>
                ) : replies.length === 0 ? (
                    <p>댓글이 없습니다.</p>
                ) : (
                    <ul>
                        {replies.map((reply) => (
                            <li key={reply.id} style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}>
                                <p><strong>{reply.title || "제목 없음"}</strong></p>
                                <p>{reply.content}</p>
                                <p style={{ fontSize: 12, color: "#666" }}>
                                    작성자: {reply.memberNickname || reply.memberId} · {reply.regDate}
                                </p>
                                <div style={{ marginTop: 8 }}>
                                    <button onClick={() => handleUpdateReply(reply.id, reply.content)} style={{ marginRight: 8 }}>
                                        수정
                                    </button>
                                    <button onClick={() => handleDeleteReply(reply.id)} style={{ color: "red" }}>
                                        삭제
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* 댓글 작성 폼 */}
                <div style={{ marginTop: 16 }}>
                    <textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="댓글을 입력하세요"
                        style={{ width: "100%", minHeight: 60 }}
                    />
                    <button onClick={handleCreateReply} style={{ marginTop: 8 }}>
                        댓글 등록
                    </button>
                </div>
            </div>
        </div>
    );
}