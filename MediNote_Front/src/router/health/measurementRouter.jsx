import {lazy} from "react";
import MeasurementList from "../../pages/health/MeasurementList.jsx";
import MeasurementChart from "../../pages/health/MeasurementChart.jsx";
import MyCareIndex from "./MycareIndex.jsx";

const Measurement = lazy(() => import("@/pages/health/Measurement.jsx"));
const MeasurementEdit = lazy(() => import("@/pages/health/MeasurementEdit.jsx"));

const measurementRouter = [

  {
    path: "/health/measurement", element: <Measurement />
  },
  {
    path: "/health/measurement/:id/edit", element: <MeasurementEdit />
  },

  //메인 -> 마이케어

  {
    path: "/mycare", element: <MyCareIndex />,
  },

  {
    path: "/mycare/register",
    element: <Measurement />  // 같은 컴포넌트 재사용
  },
  {
    path: "/mycare/list",
    element: <MeasurementList mode="page" />
  },
  {
    path: "/mycare/chart",
    element: <MeasurementChart />
  },
];

export default measurementRouter;
