import TestUIPage from "./TestUIPage.jsx";
import TestMeasurement from "./TestMeasurement.jsx";
import TestMeasurementChart from "./TestMeasurementChart.jsx";


export default {
  title: "Test/measurement/main",
  component: TestUIPage,
  parameters: {
    reactRouterPath: "/member",
    reactExtraPath : [
        // {path: "/member/signup", element: <TestRegisterPage/>},
      // {path: "/member/mypage", element: <TestMyPage/>},
      {path: "/health/measurement", element: <TestMeasurement/> },
      { path: "/health/measurement/chart", element: <TestMeasurementChart /> }
      // {path: "/qna", element: <QnAList/>},
      // {path: "/qna/register", element: <QnARegister/>},
      // {path: "/social/signup", element: <SocialRegister/>}
    ]
  }
};
export const Login = () =><TestUIPage/>