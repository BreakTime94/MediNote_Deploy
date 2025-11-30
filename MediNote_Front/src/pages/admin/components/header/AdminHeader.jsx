import React from "react";
import TextButton from "@/components/common/button/TextButton.jsx";
import IconButton from "@/components/common/button/IconButton.jsx";
import { IoIosSearch } from "react-icons/io";
import {useNavigate} from "react-router-dom";
import {useAuthStore} from "@/components/common/hooks/useAuthStore.jsx";
import api from "@/components/common/api/axiosInterceptor.js";

function AdminHeader() {
  const navigate = useNavigate();
  const{member, setMember} = useAuthStore();
    return (
        <header className="w-full bg-white px-6 py-4 ">
            <div className="max-w-7xl mx-auto flex items-center justify-between ">
                {/* 좌측 로고 영역 */}
                <div className="flex items-center hover:cursor-pointer" onClick={()=>{navigate("/")}}>
                    {/* 로고 플레이스홀더 */}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-gray-100 text-sm font-bold">M</span>
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent tracking-tight">
                        medinote admin
                      </span>
                    </div>
                </div>

                {/* 우측 버튼들 */}
                <div className="flex items-center space-x-4">
                    <IconButton
                        onClick={() => alert("검색 버튼 클릭!")}
                        ariaLabel="검색"
                    >
                        <IoIosSearch size={20} />
                    </IconButton>

                  {/* 로그인 완료 */}
                  {member && (
                      <>
              <span className="text-sm text-gray-700">
                {member.nickname} 님 반갑습니다!
              </span>
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

export default AdminHeader;