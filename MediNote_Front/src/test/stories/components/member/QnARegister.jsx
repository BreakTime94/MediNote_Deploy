import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function QnARegister() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (status) => {
        const payload = {
            memberId: 1,            // 고정
            boardCategoryId: 2,     // 고정
            title,
            content,
            isPublic: true,
            requireAdminPost: false,
            qnaStatus: "WAITING",   // 고정
            postStatus: status      // 버튼에 따라 DRAFT / PUBLISHED
        };

        try {
            const res = await fetch("/boards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("등록 성공!");
                navigate("/qna"); // 등록 후 목록으로 이동
            } else {
                alert("등록 실패");
            }
        } catch (err) {
            console.error(err);
            alert("에러 발생");
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>QnA 등록</h2>
            <div>
                <label>
                    제목:{" "}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    내용:{" "}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </label>
            </div>
            <div style={{ marginTop: "1rem" }}>
                <button onClick={() => handleSubmit("DRAFT")}>임시저장</button>
                <button onClick={() => handleSubmit("PUBLISHED")}>등록</button>
            </div>
        </div>
    );
}