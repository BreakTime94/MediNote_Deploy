// src/test/stories/QnAList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../member/axiosInterceptor.js";

export default function QnAList() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const size = 5;
    const navigate = useNavigate();

    const fetchData = async (pageNum = 1) => {
        try {
            const body = {
                cond: {
                    qnaStatus: "WAITING", // 필요 없으면 null 가능
                },
                criteria: {
                    page: pageNum,
                    size,
                },
            };

            const res = await api.post(
                "/boards/qna/list",
                body
            );

            setItems(res.data.items || []);
            setTotal(res.data.page?.totalElements || 0);
            setPage(pageNum);
        } catch (err) {
            console.error("QnA 목록 조회 실패:", err);
        }
    };

    useEffect(() => {
        fetchData(1);
    }, []);

    const totalPages = Math.ceil(total / size);

    return (
        <div style={{ padding: 16 }}>
            <h3>QnA 리스트 테스트</h3>
            <ul>
                {items.map((qna) => (
                    <li key={qna.id} style={{ marginBottom: 8 }}>
                        <strong
                            style={{ cursor: "pointer", color: "blue" }}
                            onClick={() => navigate(`/qna/read/${qna.id}`)}
                        >
                            {qna.title}
                        </strong>{" "}
                        ({qna.qnaStatus})
                        <button
                            onClick={() => navigate(`/qna/modify/${qna.id}`)}
                            style={{
                                marginLeft: 8,
                                padding: "2px 6px",
                                background: "#ffc107",
                                border: "1px solid #ccc",
                                cursor: "pointer",
                            }}
                        >
                            수정
                        </button>
                        <button
                            onClick={() => navigate(`/qna/delete/${qna.id}`)}
                            style={{
                                marginLeft: 4,
                                padding: "2px 6px",
                                background: "#dc3545",
                                color: "white",
                                border: "1px solid #ccc",
                                cursor: "pointer",
                            }}
                        >
                            삭제
                        </button>
                    </li>
                ))}
            </ul>

            <div style={{ marginTop: 16 }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        onClick={() => fetchData(p)}
                        style={{
                            margin: "0 4px",
                            padding: "4px 8px",
                            background: p === page ? "#333" : "#eee",
                            color: p === page ? "#fff" : "#000",
                            border: "1px solid #ccc",
                            cursor: "pointer",
                        }}
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>
    );
}
