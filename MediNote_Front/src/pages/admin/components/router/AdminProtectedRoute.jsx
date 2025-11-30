import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/components/common/hooks/useAuthStore.jsx";

export default function AdminProtectedRoute() {
  const { member } = useAuthStore();

  // 로그인 안 한 경우 → 관리자 로그인 페이지로
  if (!member) {
    return <Navigate to="/admin" replace />;
  }

  // 로그인은 했지만 ADMIN이 아닌 경우 → 일반 홈으로
  if (member.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // ADMIN일 때만 정상 렌더링
  return <Outlet />;
}
