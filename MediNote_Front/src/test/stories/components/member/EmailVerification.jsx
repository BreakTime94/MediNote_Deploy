import React, {useState} from "react";
import api from "./axiosInterceptor.js"
import {show} from "../common/ui/toast/commonToast.jsx";
import {useEmailTimer} from "./useEmailTimer.jsx";

function RegisterEmailField({ member, touched, errors, emailStatus, handleBlur, change, verification, setVerification }) {

  const [verificationCode, setVerificationCode] = useState(""); // 사용자가 입력한 코드
  const [showCodeInput, setShowCodeInput] = useState(false); // 코드 입력창 표시 여부
  const {leftTime, startTimer, formatTime, stopTimer} = useEmailTimer();

  // 인증메일 요청 (then/catch)
  const handleSendVerificationCode = () => {
    api
        .post("/member/email/send", null, {
          params: {email: member.email}
        })
        .then((resp) => {
          show.success({
            title : resp.data.message,
            desc: resp.data.desc
          }
          );
          startTimer();
          setShowCodeInput(true);
        })
        .catch(() => {
          show.error({
            title : "인증 메일 발송에 실패했습니다.",
            desc: "잠시 후 다시 시도하여주시기 바랍니다."}
          );
        });
  };

  // 인증코드 확인 (then/catch)
  const handleVerifyCode = () => {
    api
        .post("/member/email/verify", {
          email: member.email,
          code: verificationCode,
        })
        .then((res) => {
          if (res.data.available === true) {
            show.success({title: res.data.message});
            setVerification(true);
            setShowCodeInput(false);
            stopTimer()
          } else {
            show.formerr({title: "인증 코드가 올바르지 않습니다."});
          }
        })
        .catch(() => {
          show.error({title: "인증 확인 중 오류가 발생했습니다."});
        });
  };

  return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          이메일
        </label>
        {/* 이메일 입력창 (인증 완료되면 disabled 처리) */}
        <input
            id="email"
            name="email"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            placeholder="이메일을 입력하세요"
            onBlur={handleBlur}
            onChange={(e) => {
              change(e);
              setVerification(false);
              setShowCodeInput(false);
            }}
            value={member.email}
            disabled={verification} // 인증 완료 시 수정 불가
        />

        {/* 인증 메일 요청 버튼 */}
        {touched.email && !errors.email && emailStatus==="available" && member.email !== member.extraEmail &&(
            <button
                type="button"
                className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleSendVerificationCode}
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
                  onClick={handleVerifyCode}
              >
                확인
              </button>
            </div>
        )}
        {!showCodeInput && verification && (
            <ul className="mt-2 text-xs">
              <li className="text-blue-500">이메일 인증이 완료되었습니다.</li>
            </ul>
        )}

        {/* 에러 메시지 */}
        {touched.email && errors.email && (
            <ul className="mt-2 text-xs">
              <li className="text-red-500">{errors.email}</li>
            </ul>
        )}

        {/* 중복 검사 메시지 */}
        {touched.email && !errors.email && emailStatus !== "idle" && member.email !== member.extraEmail && !verification && (
            <ul className="mt-2 text-xs">
              <li className={emailStatus === "available" ? "text-blue-500" : "text-red-500"}>
                {emailStatus === "available" ? "사용 가능한 이메일입니다." : "사용하실 수 없는 이메일입니다."}
              </li>
            </ul>
        )}
        {/* extraEmail과 email 중복 방지 */}
        {touched.email && !errors.email && member.email && member.email === member.extraEmail &&
            (<ul className={"mt-2 text-xs"}>
              <li className={"text-red-500"}>추가 이메일과 같은 이메일을 사용하실 수 없습니다.</li>
            </ul>)}
      </div>
  );
}

export default RegisterEmailField;
