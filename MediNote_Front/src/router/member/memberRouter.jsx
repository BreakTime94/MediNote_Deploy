import { lazy } from "react";
import ProtectedRoute from "@/router/protector/ProtectionRoute.jsx";

const Login = lazy(() => import("@/pages/member/Login.jsx"));
const FindPassword = lazy(() => import("@/pages/member/FindPassword.jsx"));
const Profile = lazy(() => import("@/pages/member/Profile"));
const SocialRegister = lazy(() => import("@/pages/member/SocialRegister.jsx"))
const RegisterPage = lazy(() => import("@/pages/member/RegisterPage.jsx"))
const FindEmail = lazy(() => import("@/pages/member/FindEmail.jsx"))
const ChangePassword = lazy(() => import("@/pages/member/ChangePassword.jsx"))
const MyPage = lazy(() => import("@/pages/mypage/MyPage.jsx"))

const memberRouter = [
    //비보호 구간
  {path: "/member/register", element:<RegisterPage/>},
  {path: "/member/find/email", element: <FindEmail/>},
  {path: "/member/find/password", element: <FindPassword />,},
  {path: "/member/login", element: <Login />,}, {path: "/member/social/register", element: <SocialRegister/>,},
    //보호 구간 (member 정보가 있어야 접근 가능한 라우터들)
  {
    element: <ProtectedRoute/>,
    children:[
      {path: "/member/change/password", element: <ChangePassword/>},
      {path: "/member/mypage", element: <MyPage/>,},
      {path: "/member/profile", element: <Profile/>}
    ],
  }
];

export default memberRouter;