import React, {lazy} from "react";
import { createBrowserRouter} from "react-router-dom";
import RootLayout from '../layouts/RootLayout.jsx'
import memberRouter from "@/router/member/memberRouter.jsx";
import mapRouter from "@/router/map/mapRouter.jsx";
import AdminRootLayout from "@/pages/admin/components/layouts/AdminRootLayout.jsx";
import AdminIndex from "@/pages/admin/components/home/AdminIndex.jsx";
import AdminProtectedRoute from "@/pages/admin/components/router/AdminProtectedRoute.jsx";
import previewRouter from "@/router/health/SummarySectionPreviewRouter.jsx";
import SummarySectionPreview from "@/pages/health/SummarySectionPreview.jsx";
import ProtectedRoute from "./protector/ProtectionRoute.jsx";
import measurementRouter from "./health/measurementRouter.jsx";
import BoardRouter from "@/router/board/BoardRouter.jsx";
import newsRouter from "@/router/news/newsRouter.jsx";

//Lazy 로드
const Index = lazy(() => import("../pages/home/Index.jsx"))
const ComingSoon = lazy(() => import("../components/dummy/ComingSoon.jsx"));

const router = createBrowserRouter([
    {
        path:"/",
        element:<RootLayout/>,
        children:[
            //이곳에는 페이지 연결
            //인텍스 페이지
            {index: true, element: <Index />},
            // {index: true, element: <SummarySectionPreview />},
            ...memberRouter,
            ...previewRouter,

            // 지도 관련 라우터 ✅
            ...mapRouter,
            ...BoardRouter,
            ...newsRouter,
            // 보호 구간: 가드로 감싸서 하위 라우트 보호, 인증 필요한 페이지
            {
              element: <ProtectedRoute />,
              children: [
                ...measurementRouter
              ]
            },

            // ✅ 루트 레벨의 coming-soon
            { path: "coming-soon", element: <ComingSoon /> },
        ]
    },
  {
    path: "/admin",
    element: <AdminIndex />, // 로그인 페이지
  },
  {
    path: "/admin/main",
    element: <AdminProtectedRoute />, // 로그인 검증
    children: [
      {
        element: <AdminRootLayout />, // 관리자 레이아웃
        children: [
          { index: true, element: <div>관리자 메인입니다</div> },
          // 다른 관리자 페이지들
        ],
      },

    ],
  },
]);

export default router;