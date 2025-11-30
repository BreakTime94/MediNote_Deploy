import React from "react";
import { useAuthStore } from "@/components/common/hooks/useAuthStore.jsx";
import MeasurementChart from "@/pages/health/MeasurementChart.jsx";
import SummarySectionPreview from "@/pages/health/SummarySectionPreview.jsx";
import { useNavigate } from "react-router-dom";

export default function MyCareIndex() {
  const { member, loading } = useAuthStore();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-500">로딩 중...</div>
      </div>
    );
  }

  //  로그인된 경우 → 내 건강 차트 보여주기
  if (member) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          {member.name ? `${member.name}님의 건강 리포트` : "내 건강 리포트"}
        </h1>
        <MeasurementChart />
      </div>
    );
  }

  //  비회원일 경우 → 프리뷰 + 로그인 유도
  return (
    <div className="max-w-5xl mx-auto py-16 px-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        로그인하고 나만의 건강 리포트를 확인해보세요 💪
      </h2>

      {/* 프리뷰 */}
      <div className="mb-10">
        <SummarySectionPreview />
      </div>

      {/* 로그인 버튼 */}
      <button
        onClick={() => navigate("/member/login")}
        className="inline-block bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:opacity-90 transition duration-200"
      >
        로그인하러 가기
      </button>

      <p className="mt-4 text-gray-500 text-sm">
        아직 회원이 아니신가요?{" "}
        <button
          onClick={() => navigate("/member/register")}
          className="text-pink-500 underline hover:text-pink-600"
        >
          회원가입
        </button>
      </p>
    </div>
  );
}
