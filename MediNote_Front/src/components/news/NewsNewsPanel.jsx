// src/components/news/NewsNewsPanel.jsx
import React from "react";
import NewsListPanel from "./NewsListPanel.jsx";

export default function NewsNewsPanel({ className = "" }) {
    return (
        <NewsListPanel
            mode="news"
            searchType="NEWS"
            title="뉴스"
            className={className}
            asideSectionIds={{ latest: "latest", search: "search-result" }}
        />
    );
}
