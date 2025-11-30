import React, {useState} from "react";
import api from "./axiosInterceptor.js";
import {useNavigate} from "react-router-dom";
import GoogleLoginButton from "../../member/GoogleLoginButton.jsx";



function testUIPage(props) {
  const [loginDto, setLoginDto] = useState({email: "", password: ""})
  const navigate = useNavigate();

  console.log("useNavigate 두둥 등장")

  const register = e => {
    e.preventDefault();
    navigate("/member/signup");
  };

  const handleChange = (e) => {
    e.preventDefault();
    let input = loginDto;
    const {name, value} = e.target // {email : value, password: value}
    input[name] = value;
    setLoginDto(input)

  }

  const login = e => {
    console.log( "login 정보",loginDto)
    e.preventDefault()
    api.post("/member/auth/login", loginDto, {withCredentials: true})
        .then((resp) => {
          console.log("Content-Type", resp.headers['content-type'])
          navigate("/health/measurement")
        })
        .catch((error) => {
          console.log("error", error)
    });
  }

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
          {/* 아이디 입력 */}
          <div className="mb-4">
            <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
              아이디
            </label>
            <input
                id="email"
                name="email"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="아이디를 입력하세요" onChange={handleChange}
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
                id="password"
                name="password"
                type="password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="비밀번호를 입력하세요" onChange={handleChange}
            />
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-2">
            <button
                type="button"
                className="flex-1 bg-pink-300 text-white py-2 rounded-lg
                     hover:bg-pink-400 active:bg-pink-500 cursor-pointer"
                onClick={login}
            >
              로그인
            </button>
            <button
                type="button"
                className="flex-1 bg-purple-300 text-gray-700 py-2 rounded-lg shadow
                     hover:bg-purple-400 active:bg-purple-500 cursor-pointer"
            onClick={register}
            >
              회원가입
            </button>
          </div>
          {/*소셜 계정 구글 로그인 */}
          <div className="mt-2">
            <GoogleLoginButton></GoogleLoginButton>
          </div>
        </div>
      </div>
  );
}
export default testUIPage