import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton.jsx";
import {show} from "../common/ui/toast/commonToast.jsx";

function testUIPage(props) {
  const [loginDto, setLoginDto] = useState({email: "", password: ""})
  const navigate = useNavigate();

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
    e.preventDefault()
    axios.post("/api/member/auth/login", loginDto, {withCredentials: true})
        .then((resp) => {
          show.success({
            title: resp.data.status,
            disc: resp.data.message
          })
          navigate("/member/mypage")
        })
        .catch((error) => {
          const {code, message} = error.response?.data || {};
          console.error("[LOGIN ERROR]", code, message);

          switch (code) {
            case "MEMBER_NOT_FOUND":
              show.error({
                title: message || "존재하지 않는 회원입니다.",
                desc: "회원가입 페이지로 이동합니다.",
              });
              navigate("/member/signup");
              break;

            case "MEMBER_PASSWORD_INVALID":
              show.error({
                title: message || "비밀번호가 일치하지 않습니다.",
                desc: "비밀번호를 다시 확인해주세요.",
              });
              break;

            case "MEMBER_DELETED":
              show.error({
                title: message || "삭제된 회원입니다.",
                desc: "복구를 원하시면 고객센터로 문의해주세요.",
              });
              break;

            default:
              show.error({
                title: message || "로그인 중 오류가 발생했습니다.",
                desc: "잠시 후 다시 시도해주세요.",
              });
          }
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
          <div className="mb-2">
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
          <div className={"mb-3"}>
            <div className={"flex justify-center items-center"}>
              <div className={"flex-1 flex justify-center items-center"}>
                <span className={"text-xs cursor-pointer hover:underline"} onClick={() => {
                  navigate("/member/findEmail");
                }}>아이디 찾기</span>
              </div>
              <div className={"flex-1 flex justify-center items-center"}>
                <span className={"text-xs cursor-pointer hover:underline"} onClick={() => {
                  navigate("/member/resetPassword");
                }}>비밀번호 찾기</span>
              </div>
            </div>
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
        <button onClick={() => {
          navigate("/member/infoTest")
        }}>
          MemberInfoTest
        </button>
      </div>
  );
}
export default testUIPage