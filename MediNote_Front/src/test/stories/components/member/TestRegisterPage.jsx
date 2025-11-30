import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import api from "./axiosInterceptor.js";

import duplicateCheck from "./UseDuplicateCheck.jsx";
import RegisterEmailField from "./RegisterEmailField.jsx";

function TestRegisterPage(props) {
  // Router의 이동수단
  const navigate = useNavigate();
  //member 등록 정보
  const [member, setMember] = useState({
    email : "",
    password : "",
    extraEmail: "",
    nickname: ""
  })
  // 비밀번호 & 비밀번호 확인
  const[password, setPassword] = useState({
    password: "",
    passwordCheck: "",
  })

  // 최초 입력값에 focus가 되었는지 여부에 유효성 검증 문구 안내
  const[touched, setTouched] = useState({
    email : false,
    password: false,
    passwordCheck : false,
    extraEmail: false,
    nickname: false,
  })

  //최초 입력란에 마우스가 클릭 된 순간 작동하는 함수
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validation(name, value) }));
  };

  // 비밀번호 제외 유효성 검사를 위한 function
  const validation = (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "이메일은 필수입니다.";
        if (!/^(?!.*\s)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
          return "문자 내 공백은 불가하며, 올바른 이메일 형식이어야 합니다. ex) aaa@bbb.ccc 등";
        }
        break;

      case "extraEmail":
        if (!value) return "추가 이메일은 필수입니다.";
        if (!/^(?!.*\s)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
          return "문자 내 공백은 불가하며, 올바른 이메일 형식이어야 합니다. ex) aaa@bbb.ccc 등";
        }
        break;

      case "nickname":
        if (!value) return "닉네임은 필수입니다.";
        if (!/^(?!.*\s)[가-힣a-zA-Z0-9]{2,16}$/.test(value)) {
          return "문자 내 공백은 불가하며, 닉네임은 한글, 영문, 숫자만 사용하여 2~16자까지 가능합니다.";
        }
        break;

      default:
        return "";
    }
    return "";
  }

  const change = (e) => {
    e.preventDefault();
    const{name, value} = e.target;

    setMember((prev) => ({
      ...prev, [name] : value
    }));

    if (!touched[name]) {
      setTouched((prev) => ({...prev, [name]: true}));
    }

    setErrors((prev) => ({ ...prev, [name]: validation(name, value) }));

  }

  // register시에 발생할 수 있는 error 상태 모음
  const [errors, setErrors] = useState({});

  //비밀번호의 유효성 검증을 담은 상수 값
  const passwordRules = {
    length: password.password.length >= 8 && password.password.length <= 16,
    number: /[0-9]/.test(password.password),
    letter: /[a-zA-Z]/.test(password.password),
    special: /[!@#$%^&*]/.test(password.password),
    noSpace: !/\s/.test(password.password),
  };

  // 비밀번호 & 비밀번호가 확인은 onChange로 값이 바뀔 때 마다 계산
  const passwordMatch = password.password && password.passwordCheck && password.password === password.passwordCheck

  const passwordChange = (e) => {
    e.preventDefault();
    const{name, value} = e.target
    //touched 활성화
    if (!touched[name]) {
      setTouched((prev) => ({...prev, [name]: true}));
    }
    // 프론트 단에서 Password 유효성 검증을 위한 State 관리
    setPassword((prev)=> ({...prev, [name]: value}));
    // Member State 값에도 저장해둠
    setMember((prev) => ({...prev, [name] : value}));
  }

  //중복검사 로직 상태 String 값 available로 나와야 합격
  const emailStatus = duplicateCheck("email", member.email, "/member/check/email", validation);
  const extraEmailStatus = duplicateCheck("email", member.extraEmail, "/member/check/email", validation);
  const nicknameStatus = duplicateCheck("nickname", member.nickname, "/member/check/nickname", validation);

  // 이메일 인증에서 사용할 props
  const [verification, setVerification] = useState(false); // 인증 완료 여부

  // 유효성 검사, 중복체크에 통과하면, 버튼 활성화
  const isDisabled = !passwordMatch || Object.values(passwordRules).some(r => !r) || Object.values(errors).some((e)=> e && e.length > 0) ||
      emailStatus !== "available" || extraEmailStatus !== "available" || nicknameStatus !== "available" || !verification;

  //작성내용 제출
  const submit = (e) => {
    e.preventDefault()

    api.post(`/member/register`, member)
        .then((res) => {
          console.log("Content-Type", res.headers[`content-type`])
          navigate("/member")
        })
        .catch((error) => {
          console.log("error", error);
        });
  }

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
          {/* 이메일 입력 */}
          <RegisterEmailField member={member} touched={touched} errors={errors} emailStatus={emailStatus}
                              handleBlur={handleBlur} change={change} verification={verification} setVerification={setVerification}/>
          {/* 비밀번호 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
                id="password"
                name="password"
                type="password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="비밀번호를 입력하세요"
                onBlur={()=> {
                  setTouched((prev)=> ({...prev, password: true}))
                }}
                onChange={passwordChange}
            />
            {/* 에러 메세지*/}
            {touched.password &&
            (<ul className={"mt-2 text-xs"}>
              <li className={touched.password && passwordRules.length ? "text-blue-500" : "text-red-500"}>
                비밀번호는 8자 ~ 16자 사이여야 합니다.
              </li>
              <li className={passwordRules.number ? "text-blue-500" : "text-red-500"}>
                비밀번호는 숫자를 1개이상 포함하여야 합니다.
              </li>
              <li className={passwordRules.letter ? "text-blue-500" : "text-red-500"}>
                비밀번호는 영문자를 1개이상 포함하여야 합니다.
              </li>
              <li className={passwordRules.special ? "text-blue-500" : "text-red-500"}>
                비밀번호는 특수문자를 1개이상 포함하여야 합니다.
              </li>
              <li className={passwordRules.noSpace ? "text-blue-500" : "text-red-500"}>
                비밀번호에는 공백이 포함될 수 없습니다.
              </li>
            </ul>)}
          </div>
          {/* 비밀번호 확인 */}
          <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            비밀번호 확인
          </label>
          <input
              id="passwordCheck"
              name="passwordCheck"
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="위에 입력하신 비밀번호를 입력하여주세요."
              onBlur={()=> {
                setTouched((prev)=> ({...prev, passwordCheck: true}))
              }}
              onChange={passwordChange}
          />
            {/* 에러 메세지*/}
            {touched.passwordCheck &&
            (<ul className={"mt-2 text-xs"}>
              <li className={passwordMatch ? "text-blue-500" : "text-red-500"}>
                {passwordMatch ? `비밀번호가 일치합니다` : `비밀번호가 일치하지 않습니다.`}
              </li>
            </ul>)}
        </div>
          {/* 추가 이메일 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              추가이메일
            </label>
            <input
                id="extraEmail"
                name="extraEmail"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="추가 이메일을 입력하여주세요."
                onBlur={handleBlur}
                onChange={change}
            />
            {/* 에러 메세지*/}
            {touched.extraEmail && errors.extraEmail &&
              (<ul className={"mt-2 text-xs"}>
                <li className={"text-red-500"}>{errors.extraEmail}</li>
              </ul>)}
            {/* 중복 체크 메세지*/}
            {touched.extraEmail && !errors.extraEmail && extraEmailStatus !== "idle" && member.email !== member.extraEmail &&
                (<ul className={"mt-2 text-xs"}>
                  <li className={extraEmailStatus === "available" ? "text-blue-500" :"text-red-500"}>
                    {extraEmailStatus === "available" ? "사용 가능한 이메일입니다." : "사용하실 수 없는 이메일입니다."}
                  </li>
                </ul>)}
            {/* extraEmail과 email 중복 방지 */}
            {touched.extraEmail && !errors.extraEmail && member.extraEmail === member.email &&
                (<ul className={"mt-2 text-xs"}>
                  <li className={"text-red-500"}>로그인용 이메일과 같은 이메일을 사용하실 수 없습니다.</li>
                </ul>)}
          </div>
          {/* 닉네임 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              닉네임
            </label>
            <input
                id="nickname"
                name="nickname"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="닉네임을 입력하세요"
                onBlur={handleBlur}
                onChange={change}
            />
            {/* 에러 메세지*/}
            {touched.nickname && errors.nickname &&
                (<ul className={"mt-2 text-xs"}>
                  <li className={"text-red-500"}>{errors.nickname}</li>
                </ul>)}
            {/* 중복체크 메세지 */}
            {touched.nickname && !errors.nickname && nicknameStatus !== "idle" && (
                <ul className={"mt-2 text-xs"}>
                  <li className={nicknameStatus === "available" ? "text-blue-500" :"text-red-500"}>
                    {nicknameStatus === "available" ? "사용 가능한 닉네임입니다." : "사용하실 수 없는 닉네임입니다."}
                  </li>
                </ul>
            )}
          </div>
          {/* 버튼 영역 */}
          <div className="flex gap-2">
            <button
                type="submit"
                className={`flex-1  text-white py-2 rounded-lg
                     ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-pink-300 hover:bg-pink-400 active:bg-pink-500 cursor-pointer" }`}
                disabled={isDisabled}
                onClick={submit}
            >
              제출하기
            </button>
          </div>
        </div>
      </div>
  );
}
export default TestRegisterPage