import React, {useState} from "react";
import useCheckPassword from "./useCheckPassword.jsx";
import axios from "axios";
import {show} from "../common/ui/toast/commonToast.jsx";
import {useNavigate} from "react-router-dom";

export default function ChangePassword() {
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
    axios.patch("/api/member/change/password", newPassword)
        .then((resp) => {
          show.success({
            title: resp.data.status,
            desc: resp.data.message
          })
          navigate("/member")
        })
        .catch((error) => {
          show.error({
            title: error.data.code,
            desc: error.data.message
          })
        })
  }

  return(
      <div className={"mx-auto border-1"}>
        <label>비밀번호 변경</label>
        <div>
          <label className={"block"}>기존 비밀번호</label>
          <input id="oldPassword" name="oldPassword" type="password" className={"border-1"} placeholder={"현재 비밀번호를 입력하여주세요."}
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
        <div>
          <label className={"block"}>신규비밀번호</label>
          <input id="password" name="password" type="password" className={"border-1"} placeholder={"변경하실 비밀번호를 입력하여주세요."} onChange={passwordChange}
                 onBlur={()=> {setTouched((prev)=> ({...prev, password: true}))}}/>
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
        <div>
          <label className={"block"}>신규비밀번호 확인</label>
          <input id="passwordCheck" name="passwordCheck" type="password" className={"border-1"} placeholder={"변경하실 비밀번호를 다시 입력하여주세요."} onChange={passwordChange}
                 onBlur={()=> {setTouched((prev)=> ({...prev, passwordCheck: true}))}}/>
          {/* 에러 메세지*/}
          {touched.passwordCheck &&
              (<ul className={"mt-2 text-xs"}>
                <li className={passwordMatch ? "text-blue-500" : "text-red-500"}>
                  {passwordMatch ? `비밀번호가 일치합니다` : `비밀번호가 일치하지 않습니다.`}
                </li>
              </ul>)}
        </div>
        <div>
          <button type="submit"
                  className={`flex-1  text-white py-2 rounded-lg
                     ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-pink-300 hover:bg-pink-400 active:bg-pink-500 cursor-pointer" }`}
                  disabled={isDisabled}
                  onClick={changeConfirm}
                  >비밀번호 변경</button>
        </div>
      </div>
  );
}