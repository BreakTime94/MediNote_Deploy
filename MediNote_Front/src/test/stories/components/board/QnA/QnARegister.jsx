import React, { useState } from "react";
import axios from "axios"; // 임시: 인터셉터 X, 직접 axios 호출
import { useNavigate } from "react-router-dom";
import api from "../../member/axiosInterceptor.js";

export default function QnARegister() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // BoardCreateRequestDTO 에 맞춰 body 생성
            const body = {
                memberId: 1, // 테스트용 (실제는 로그인 세션에서 가져옴)
                boardCategoryId: 2, // QnA 카테고리 고정
                title,
                content,
                requireAdminPost: false,
                isPublic: true,
                qnaStatus: "WAITING",
                postStatus: "PUBLISHED",
            };

            const res = await api.post(
                "/boards/register",
                body,
                { headers: { "Content-Type": "application/json" } }
            );

            alert("등록 성공! id=" + res.data.id);

            // 등록 성공 후 QnAList 로 이동
            navigate("/qna");
        } catch (err) {
            console.error("QnA 등록 실패:", err);
            alert("등록 실패");
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h3>QnA 등록 테스트</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 8 }}>
                    <label>
                        제목:{" "}
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>
                        내용:{" "}
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit" style={{ padding: "4px 12px" }}>
                    등록
                </button>
            </form>
        </div>
    );
}