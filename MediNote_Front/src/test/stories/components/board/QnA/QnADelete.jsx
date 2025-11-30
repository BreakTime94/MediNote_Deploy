// src/test/stories/QnADelete.jsx
import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../member/axiosInterceptor.js";

export default function QnADelete() {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const body = {
                requesterId: 1, // 임시 (실제 로그인 유저 ID로 대체해야 함)
                reason: "테스트 삭제",
            };

            await api.delete(`/boards/delete/${id}`, {
                data: body, // axios는 DELETE에 body 보낼 때 data로 명시해야 함
            });

            alert("삭제 완료!");
            navigate("/qna"); // 삭제 후 목록으로 이동
        } catch (err) {
            console.error("삭제 실패:", err);
            alert("삭제 실패");
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h3>QnA 삭제 페이지 (ID: {id})</h3>
            <button
                onClick={handleDelete}
                style={{ background: "red", color: "white", padding: "8px 12px" }}
            >
                삭제하기
            </button>
        </div>
    );
}