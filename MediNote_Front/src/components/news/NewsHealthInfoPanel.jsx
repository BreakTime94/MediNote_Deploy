// src/components/news/NewsHealthInfoPanel.jsx
import React from "react";
import NewsListPanel from "./NewsListPanel.jsx";

export default function NewsHealthInfoPanel({ className = "" }) {
    return (
        <NewsListPanel
            mode="health-info"
            searchType="HEALTH_INFO"
            title="건강정보"
            className={className}
            asideSectionIds={{ latest: "latest", search: "search-result" }}
        />
    );
}
