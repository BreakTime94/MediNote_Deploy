import React, {useState} from "react";
import {useEmailVerification} from "./useEmailVerification.jsx";
import {show} from "@/test/stories/components/common/ui/toast/commonToast.jsx";

import api from "../../components/common/api/axiosInterceptor.js";
import {useNavigate} from "react-router-dom";

export default function FindEmail() {
  const [extraEmail, setExtraEmail] = useState("");

  // 이메일 인증에서 사용할 props
  const [verification, setVerification] = useState(false); // 인증 완료 여부

  // 최초 입력값에 focus가 되었는지 여부에 유효성 검증 문구 안내
  const[touched, setTouched] = useState({
    extraEmail : false,
  })
  const navigate = useNavigate();
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validation(name, value) }));
  };

  // register시에 발생할 수 있는 error 상태 모음
  const [errors, setErrors] = useState({});

  const validation = (name, value) => {
    switch (name) {
      case "extraEmail":
        if (!value) return "추가 이메일은 필수입니다.";
        if (!/^(?!.*\s)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
          return "문자 내 공백은 불가하며, 올바른 이메일 형식이어야 합니다. ex) aaa@bbb.ccc 등";
        }
        break;

      default:
        return "";
    }
    return "";
  }

  const change = (e) => {
    const { name, value } = e.target;
    setExtraEmail(value);
    setErrors((prev) => ({ ...prev, [name]: validation(name, value) }));
  }

  const {
    verificationCode,
    setVerificationCode,
    showCodeInput,
    setShowCodeInput,
    sendCode,
    verifyCode,
    leftTime,
    formatTime,
  } = useEmailVerification();

  return (
      <div className="flex items-center justify-center bg-white pt-16">
        <div className="mb-4 mx-auto bg-white shadow-lg rounded-2xl border p-8 w-120">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이메일
          </label>
          {/* 이메일 입력창 (인증 완료되면 disabled 처리) */}
          <input
              id="extraEmail"
              name="extraEmail"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
              placeholder="가입하셨을 때 기입한 추가 이메일을 입력하세요"
              onBlur={handleBlur}
              onChange={(e) => {
                change(e);
                setVerification(false);
                setShowCodeInput(false);
              }}
              value={extraEmail}
              disabled={verification} // 인증 완료 시 수정 불가
          />

          {/* 인증 메일 요청 버튼 */}
          {touched.extraEmail && !errors.extraEmail && !verification && (
              <button
                  type="button"
                  className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={() => {
                    sendCode(extraEmail, "find")
                    window.alert("인증코드를 발송하였습니다. 만약 코드가 도착하지 않았다면, 입력하신 이메일이 회원정보와 일치하지 않거나 " +
                        "추가 이메일 인증을 하지 않았는지 확인하여 주시기 바랍니다.")
                  }}
              >
                인증메일 요청
              </button>
          )}

          {/* 인증 코드 입력창 + 확인 버튼 */}
          {showCodeInput && !verification && (
              <div className="mt-2 flex space-x-2">
                <input
                    type="text"
                    name="verificationCode"
                    placeholder="인증코드 입력"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400  disabled:bg-gray-200"
                    disabled={verification}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                />
                {leftTime &&
                    (<span className={"text-xs text-gray-500 my-auto font-bold"}>{formatTime(leftTime)}</span>)}
                <button
                    type="button"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-amber-100"
                    disabled={verification}
                    onClick={() => {
                      verifyCode(extraEmail, verification, setVerification, "find")
                    }}
                >
                  확인
                </button>
              </div>
          )}
                {!showCodeInput && verification && (
                    <button
                        type="button"
                        className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        onClick={() => {
                          api.post("/member/find/email", {extraEmail})
                              .then((resp)=> {
                                window.alert("회원님의 아이디는 " + resp.data.email + " 입니다.")
                                navigate("/member/login")
                              }).catch((error) => {
                                show.info({
                                  title: error.response?.data?.status,
                                  message: error.response?.data?.message
                                })
                                setTimeout(()=> navigate("/member"), 2000)
                          })
                        }}
                    >
                      이메일 확인하기
                    </button>
                )}
          {!showCodeInput && verification && (
              <ul className="mt-2 text-xs">
                <li className="text-blue-500">이메일 인증이 완료되었습니다.</li>
              </ul>
          )}

          {/* 에러 메시지 */}
          {touched.extraEmail && errors.extraEmail && (
              <ul className="mt-2 text-xs">
                <li className="text-red-500">{errors.extraEmail}</li>
              </ul>
          )}
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2 mb-1">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-xm text-gray-800">유의사항</span>
            </div>
            <ul className="text-sm text-gray-600 pl-2">
              <li className="flex gap-2 ">
                <span>&middot;</span>
                <span>아이디 찾기는 추가 이메일 인증시에만 사용하실 수 있습니다.</span>
              </li>
              <li className="flex gap-2">
                <span>&middot;</span>
                <span>인증코드를 받지 못하신 경우, 가입 정보와 일치하는지 다시 한 번 확인하여 주시기 바랍니다.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
  );
}