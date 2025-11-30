import React from "react";
import TextButton from "../button/TextButton.jsx";
import IconButton from "../button/IconButton.jsx";
import { IoIosSearch } from "react-icons/io";
import {useNavigate} from "react-router-dom";
import {useAuthStore} from "@/components/common/hooks/useAuthStore.jsx";
import api from "@/components/common/api/axiosInterceptor.js";

function SiteHeader() {
  const navigate = useNavigate();
  const{member, setMember} = useAuthStore();
  return (
      <header className="w-full bg-white px-6 py-4 ">
        <div className="max-w-7xl mx-auto flex items-center justify-between ">
          {/* 좌측 로고 영역 */}
          <div className="flex items-center hover:cursor-pointer" onClick={()=>{navigate("/")}}>
            {/* 움직이는 로고 */}
            <div className="main-logo">
              <div className="character">
                <div className="pill-body">
                  <div className="pill-shine"></div>
                  <div className="face">
                    <span className="eye"></span>
                    <span className="eye"></span>
                    <div className="smile"></div>
                  </div>
                </div>
                <div className="stethoscope"></div>
              </div>
              <div>
                <div className="brand-text">medinote</div>
                <div className="tagline">개인 의료관리 시스템</div>
              </div>
            </div>
          </div>

          {/* 우측 버튼들 */}
          <div className="flex items-center space-x-4">


            {/* 비로그인 일 때 */}
            {!member && (
                <>
                  <TextButton onClick={() => navigate("/member/login")}>
                    로그인
                  </TextButton>
                  <TextButton onClick={() => navigate("/member/register")}>
                    회원가입
                  </TextButton>
                </>
            )}

            {/* 로그인 완료 */}
            {member && (
                <>
              <span className="text-sm text-gray-700">
                {member.nickname} 님 반갑습니다!
              </span>
                  <TextButton
                      isGradient
                      onClick={() => navigate("/member/mypage")}
                  >
                    마이페이지
                  </TextButton>
                  <TextButton onClick={(e) => {
                    e.preventDefault()
                    api.post("/member/auth/logout", {} ,{
                      withCredentials: true
                    }).then(() => {
                      console.log("로그아웃 성공했습니다.");
                      setMember(null);
                      navigate("/")
                    }).catch((error) => {
                      console.log("error : ", error);
                    })
                  }}>로그아웃</TextButton>
                </>
            )}
          </div>
        </div>
      </header>
  );
}

export default SiteHeader;