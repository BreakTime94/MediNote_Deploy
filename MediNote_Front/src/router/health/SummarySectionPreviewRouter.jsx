import {lazy} from "react";
//lazy : 페이지 필요할 때만 불러옴

const SummarySectionPreviewRouter = lazy( () => import("@/pages/health/SummarySectionPreview.jsx"));

const previewRouter = [
  //비보호구간
  {
    path : "/preview", element: <SummarySectionPreviewRouter />
  },
]
export default previewRouter;