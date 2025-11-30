import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/components/common/hooks/useAuthStore"; // 네 Zustand 경로 맞춰줘

export default function ProtectedRoute() {
  const { member, loading } = useAuthStore();

  if (loading) {
    return <div className="text-center py-20">로딩 중...</div>;
  }

  // 로그인 안 된 상태면 로그인 페이지로 이동
  if (!member) {
    return <Navigate to="/member/login" replace />;
  }

  // 로그인 된 경우엔 하위 라우트 렌더링
  return <Outlet />;
}
