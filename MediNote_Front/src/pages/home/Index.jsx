import React from "react";
import SummarySection from "../health/SummarySection.jsx";
import {useAuthStore} from "@/components/common/hooks/useAuthStore.jsx";
import SummarySectionPreview from "@/pages/health/SummarySectionPreview.jsx";
import { Link } from "react-router-dom";
import PreviewIndex from "@/pages/home/PreviewIndex.jsx";
import MiniMapSection from "@/components/map/MiniMapSection.jsx";
import NewsLatestPanel from "@/components/news/NewsLatestPanel.jsx";

export default function Index(){
  const {member, loading, fetchMember} = useAuthStore();
  console.log("🔍 Index.jsx - member:", member);
  console.log("🔍 Index.jsx - loading:", loading);
  //로그인 여부에 따라 화면 다르게 구성
  //이 페이지는 로그인 여부 나누기 위한 중간 문지기 역할
  //하단 보드형은 로그인 상관없이 노출

  if(loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl text-gray-600">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
      <div className="index-container">
        {/* 상단: 건강정보 영역 - 로그인 여부에 따라 다름 */}
        <section className="summary-section mb-8">
          {member ? (
              //로그인 했을 때 건강 대시보드
              <SummarySection />
          ) : (
              //비로그인시 블러처리
              <PreviewIndex />

          )}
        </section>
        {/* 하단: 게시판 영역 - 로그인 상관없이 항상 보임 (나중에 컴포넌트 붙일 자리) */}
        <section className="bottom-section max-w-7xl mx-auto">  {/* 👈 px-4 제거 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">  {/* 👈 여기로 px-4 이동 */}
            {/* 게시판 영역 - 50% (왼쪽 여백만) */}
              <div className="board-section bg-white border-2 border-gray-200 p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold">최신 건강 뉴스 📰</h2>

                      {/* 더보기 버튼 → /news (NewsNewsPanel 라우트) */}
                      <Link
                          to="/news"
                          className="px-3 py-1.5 text-sm rounded-lg ring-1 ring-gray-300 hover:bg-gray-50"
                      >
                          더보기
                      </Link>
                  </div>

                  {/* 최신 뉴스 리스트 (3개만) */}
                  <NewsLatestPanel title="최신 건강 뉴스" limit={3} />
              </div>


          {/* 오른쪽: 미니 지도 */}
          <MiniMapSection />
          </div>
        </section>
      </div>
  );
}
