import QnAList from "./QnAList.jsx";
import QnARegister from "./QnARegister.jsx";
import QnARead from "./QnARead.jsx";
import QnAModify from "./QnAModify.jsx";
import QnADelete from "./QnADelete.jsx";

export default{
    title: "Test/board/qna",
    component: QnAList,
    parameters: {
        reactRouterPath: "/qna",
        reactExtraPath : [
            {path: "/qna/register", element: <QnARegister />},
            {path: "/qna/read/:id", element: <QnARead />},
            { path: "/qna/modify/:id", element: <QnAModify /> }, // ✅ 수정 페이지
            { path: "/qna/delete/:id", element: <QnADelete /> }, // ✅ 삭제 페이지

        ]
    }
};

export const QnA = () => <QnAList />;