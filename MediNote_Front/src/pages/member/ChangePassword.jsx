import React, {useState} from "react";
import useCheckPassword from "./useCheckPassword.jsx";
import {show} from "@/test/stories/components/common/ui/toast/commonToast.jsx";
import {useNavigate} from "react-router-dom";
import api from "@/components/common/api/axiosInterceptor.js";
import {useAuthStore} from "@/components/common/hooks/useAuthStore.jsx";

export default function ChangePassword() {
  const{logout} = useAuthStore();
  const navigate = useNavigate();
  const[oldPassword, setOldPassword] = useState("");
  const[touched, setTouched] = useState({
    oldPassword: false,
    password: false,
    passwordCheck : false,
  })
  const[newPassword, setNewPassword] = useState({
    password: "",
    passwordCheck: "",
  })

  const{valid, loading, error} = useCheckPassword(oldPassword, 500);

  const passwordMatch = newPassword.password && newPassword.passwordCheck && newPassword.password === newPassword.passwordCheck

  //비밀번호의 유효성 검증을 담은 상수 값
  const passwordRules = {
    length: newPassword.password.length >= 8 && newPassword.password.length <= 16,
    number: /[0-9]/.test(newPassword.password),
    letter: /[a-zA-Z]/.test(newPassword.password),
    special: /[!@#$%^&*]/.test(newPassword.password),
    noSpace: !/\s/.test(newPassword.password),
  };

  const oldPasswordChange = (e) => {
    e.preventDefault();
    const{name, value} = e.target
    if (!touched[name]) {
      setTouched((prev) => ({...prev, [name]: true}));
    }
    setOldPassword(value)
  }

  const passwordChange = (e) => {
    e.preventDefault();
    const{name, value} = e.target
    //touched 활성화
    if (!touched[name]) {
      setTouched((prev) => ({...prev, [name]: true}));
    }
    // 프론트 단에서 Password 유효성 검증을 위한 State 관리
    setNewPassword((prev)=> ({...prev, [name]: value}));
    // Member State 값에도 저장해둠
  }
  const isDisabled = !valid || loading || error || Object.values(passwordRules).some(p => p.length > 0) || !passwordMatch || oldPassword === newPassword.password
  || !oldPassword;

  const changeConfirm = () => {
    api.patch("/member/change/password", newPassword)
        .then((resp) => {
          show.success({
            title: resp.data.status,
            desc: resp.data.message
          })
          logout();
          navigate("/member/login");
        })
        .catch((error) => {
          show.error({
            title: error.data.code,
            desc: error.data.message
          })
          navigate("/member/mypage");
        })
  }

  return(
      <div className="flex flex-col items-center justify-center bg-white">
        <div className="mb-4 mx-auto bg-white shadow-lg rounded-2xl border p-8 w-full">
          <div className={"w-full mb-4"}>
            <h3 className={"font-bold"}>비밀번호 변경</h3>
          </div>
          <div className={"mb-2"}>
            <label className={"block text-sm font-medium text-gray-700 mb-1"}>기존 비밀번호</label>
            <input id="oldPassword" name="oldPassword" type="password" className={"w-full px-3 py-1 border rounded-lg focus:outline-none"} placeholder={"현재 비밀번호를 입력하여주세요."}
            onChange={oldPasswordChange}  onBlur={()=> {
              setTouched((prev)=> ({...prev, oldPassword: true}))
            }}/>
            {touched.oldPassword &&
            (<ul className={"mt-2 text-xs"}>
              {loading && (<li className={"text-blue-500"}>비밀번호 검증중입니다.</li>)}
              {error && (<li className={"text-red-500"}>비밀번호가 일치하지 않습니다.</li>)}
              {valid && !error && !loading && (<li className={"text-blue-500"}>비밀번호가 일치합니다.</li>)}
            </ul>)}
          </div>
          <div className={"mb-2"}>
            <label className={"block text-sm font-medium text-gray-700 mb-1"}>신규비밀번호</label>
            <input id="password" name="password" type="password" className={" w-full px-3 py-1 border rounded-lg focus:outline-none"} placeholder={"변경하실 비밀번호를 입력하여주세요."} onChange={passwordChange}
                   onBlur={()=> {setTouched((prev)=> ({...prev, password: true}))}}/>
            {oldPassword === newPassword.password && oldPassword && newPassword &&
                (<ul className={"mt-2 text-xs"}>
                  <li className={"text-red-500"}>
                    기존 비밀번호와 동일하게 설정하실 수 없습니다.
                  </li>
                </ul>)}
            {touched.password && oldPassword !== newPassword.password &&
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
          <div className={"mb-2"}>
            <label className={"block text-sm font-medium text-gray-700 mb-1"}>신규비밀번호 확인</label>
            <input id="passwordCheck" name="passwordCheck" type="password" className={" w-full px-3 py-1 border rounded-lg focus:outline-none"} placeholder={"변경하실 비밀번호를 다시 입력하여주세요."} onChange={passwordChange}
                   onBlur={()=> {setTouched((prev)=> ({...prev, passwordCheck: true}))}}/>
            {/* 에러 메세지*/}
            {touched.passwordCheck &&
                (<ul className={"mt-2 text-xs"}>
                  <li className={passwordMatch ? "text-blue-500" : "text-red-500"}>
                    {passwordMatch ? `비밀번호가 일치합니다` : `비밀번호가 일치하지 않습니다.`}
                  </li>
                </ul>)}
          </div>
          <div className={"w-full text-center mt-4"}>
            <button type="submit"
                    className={`flex-1 w-full text-white px-3 py-1 rounded-lg
                       ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-pink-300 hover:bg-pink-400 active:bg-pink-500 cursor-pointer" }`}
                    disabled={isDisabled}
                    onClick={changeConfirm}
                    >비밀번호 변경</button>
          </div>
        </div>
      </div>
  );
}