// src/pages/qna/QnAPage.jsx (조합 페이지)
import React from "react";
import QnAListPanel from "../../components/qna/QnAListPanel.jsx";

export default function QnAPage() {
  return (
    <main className="w-full flex justify-center py-8 md:py-12">
      <QnAListPanel />
    </main>
  );
}
