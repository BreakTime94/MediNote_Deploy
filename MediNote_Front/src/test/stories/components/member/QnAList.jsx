import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./axiosInterceptor.js";

const QnAList = () => {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api
            .get(
                "/boards?page=1&size=10&sort=id,desc&filters%5BcategoryId%5D=2&filters%5BpostStatus%5D=PUBLISHED&filters%5BisPublic%5D=true", {
                  withCredentials: true
                }
            )
            .then((res) => {
                setBoards(res.data.items || []);
            })
            .catch((err) => {
                console.error("데이터 요청 실패", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <p>로딩중...</p>;
    if (!boards.length)
        return (
            <div>
                <p>게시글이 없습니다.</p>
                <button onClick={() => navigate("/qna/register")}>QnA 등록</button>
            </div>
        );

    return (
        <div>
            <h3>게시글 목록 (QnA)</h3>
            <button
                onClick={() => navigate("/qna/register")}
                style={{ marginBottom: "1rem" }}
            >
                QnA 등록
            </button>
            <ul>
                {boards.map((b) => (
                    <li key={b.id}>
                        <strong>{b.title}</strong> (id: {b.id}, 상태: {b.qnaStatus}, 공개여부:{" "}
                        {b.isPublic ? "공개" : "비공개"})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QnAList;