import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import googleLogo from "@/pages/member/icon/web_light_rd_na.svg";
import {show} from "@/test/stories/components/common/ui/toast/commonToast.jsx";
import {useAuthStore} from "@/components/common/hooks/useAuthStore.jsx";

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const {setMember} = useAuthStore();

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
      const{status, provider, member, message} = event.data;
      if (status === "LOGIN_SUCCESS") {
        show.success({
          title: status,
          desc: message
        })
        setMember({...member, provider})
        // 기존 회원 → 홈 화면으로
        navigate("/");
      } else if (status === "NEED_REGISTER") {
        // 신규 회원 → 회원가입 컴포넌트로 (state로 데이터 전달)
        navigate("/member/social/register", { state: {provider, member}});
      } else {
        // 그 외 에러 관련
        // show.error({
        //   title: event.response.data.status,
        //   desc: event.response.data.message
        // })
        window.alert("알 수 없는 오류입니다. 다시 시도하여 주세요.")
        navigate("/member/login")
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [navigate]);

  return (
      <button
          onClick={handleLogin}
          className="w-full h-12 flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
      >
        <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_710_6217)">
            <path d="M29.6 20.2273C29.6 19.5182 29.5364 18.8364 29.4182 18.1818H20V22.05H25.3818C25.15 23.3 24.4455 24.3591 23.3864 25.0682V27.5773H26.6182C28.5091 25.8364 29.6 23.2727 29.6 20.2273Z" fill="#4285F4"/>
            <path d="M20 30C22.7 30 24.9636 29.1045 26.6181 27.5773L23.3863 25.0682C22.4909 25.6682 21.3454 26.0227 20 26.0227C17.3954 26.0227 15.1909 24.2636 14.4045 21.9H11.0636V24.4909C12.7091 27.7591 16.0909 30 20 30Z" fill="#34A853"/>
            <path d="M14.4045 21.9C14.2045 21.3 14.0909 20.6591 14.0909 20C14.0909 19.3409 14.2045 18.7 14.4045 18.1V15.5091H11.0636C10.3864 16.8591 10 18.3864 10 20C10 21.6136 10.3864 23.1409 11.0636 24.4909L14.4045 21.9Z" fill="#FBBC04"/>
            <path d="M20 13.9773C21.4681 13.9773 22.7863 14.4818 23.8227 15.4727L26.6909 12.6045C24.9591 10.9909 22.6954 10 20 10C16.0909 10 12.7091 12.2409 11.0636 15.5091L14.4045 18.1C15.1909 15.7364 17.3954 13.9773 20 13.9773Z" fill="#E94235"/>
          </g>
          <defs>
            <clipPath id="clip0_710_6217">
              <rect width="40" height="40" fill="white" transform="translate(10 10)"/>
            </clipPath>
          </defs>
        </svg>
        <span className="text-sm font-medium text-gray-700">
    Sign in with Google
  </span>
      </button>
  );
}
