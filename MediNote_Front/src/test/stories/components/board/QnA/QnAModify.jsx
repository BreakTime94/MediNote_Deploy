// src/test/stories/QnAModify.jsx
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../member/axiosInterceptor.js";

export default function QnAModify() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const body = {
                id: Number(id),
                title,
                content,
            };

            await api.patch(`/boards/update/${id}`, body);
            alert("수정 완료!");
            navigate(`/qna/read/${id}`); // 수정 후 단일조회 페이지로 이동
        } catch (err) {
            console.error("수정 실패:", err);
            alert("수정 실패");
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h3>QnA 수정 페이지 (ID: {id})</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>제목:</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: "100%", marginBottom: 8 }}
                    />
                </div>
                <div>
                    <label>내용:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ width: "100%", height: 100 }}
                    />
                </div>
                <button type="submit">수정하기</button>
            </form>
        </div>
    );
}
