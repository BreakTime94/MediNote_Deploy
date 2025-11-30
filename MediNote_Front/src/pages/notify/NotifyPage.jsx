// src/pages/notice/NotifyPage.jsx
import React from "react";
import NotifyListPanel from "../../components/notify/NotifyListPanel.jsx";

export default function NotifyPage() {
    return (
        <main className="w-full flex justify-center py-8 md:py-12">
            <NotifyListPanel />
        </main>
    );
}
