// src/components/news/NewsColumnsPanel.jsx
import React from "react";
import NewsListPanel from "./NewsListPanel.jsx";

export default function NewsColumnsPanel({ className = "" }) {
    return (
        <NewsListPanel
            mode="columns"
            searchType="COLUMN"
            title="칼럼"
            className={className}
            asideSectionIds={{ latest: "latest", search: "search-result" }}
        />
    );
}
