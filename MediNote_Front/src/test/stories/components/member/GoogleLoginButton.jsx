import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import googleLogo from "./assets/web_light_rd_na.svg";
import {show} from "../common/ui/toast/commonToast.jsx";

export default function GoogleLoginButton() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 팝업 열기
    window.open(
        "http://localhost:8083/api/oauth2/authorization/google",
        "googleLogin",
        "width=500,height=600"
    );
  };

  useEffect(() => {
    const listener = (event) => {
      // 보안: event.origin 체크 (백엔드 주소인지 확인)
      if (event.origin !== "http://localhost:8083") return;

      console.log("로그인 결과:", event.data);

      if (event.data.status === "LOGIN_SUCCESS") {
        // 기존 회원 → 홈 화면으로
        navigate("/member/mypage");
      } else if (event.data.status === "NEED_REGISTER") {
        // 신규 회원 → 회원가입 컴포넌트로 (state로 데이터 전달)
        navigate("/social/signup", { state: event.data });
      } else {
        // 그 외 에러 관련
        show.error({
          title: event.data.status,
          desc: event.data.message
        })
        navigate("/member")
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [navigate]);

  return (
      <button onClick={handleLogin} className="w-full h-10 flex items-center justify-center gap-2 rounded-lg border cursor-pointer hover:bg-gray-50">
        <img src={googleLogo} alt="Google" className="w-10 h-10" />
        <span className="text-sm font-medium text-gray-700 leading-none">
                Sign in with Google
              </span>
      </button>
  );
}
