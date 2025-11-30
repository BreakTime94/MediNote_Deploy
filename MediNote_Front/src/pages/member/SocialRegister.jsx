import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import api from "@/components/common/api/axiosInterceptor.js";
import UseDuplicateCheck from "./UseDuplicateCheck.jsx";
import TermsSection from "@/pages/member/terms/TermsSection.jsx";
import {useAuthStore} from "@/components/common/hooks/useAuthStore.jsx";

export default function SocialRegister() {
  const location = useLocation();
  const {provider, member} = location.state; // SuccessHandler에서 받은 dto, handler에서 브라우저에 Script 형태로 status, provicer, dto 값을 JSON 형태로 담아서 실행하게 코드를 보내줌(그 중 status는 분기처리용으로만 사용)
  const [info, setInfo] = useState({
    ...member, nickname: member.nickname?.trim().replace(/\s+/g, '') || '',
            extraEmail: "" ,
            agreements: []});
  const navigate = useNavigate();
  //에러 모음 상태값
  const [errors, setErrors] = useState({});

  const {setMember} = useAuthStore();

  //일반 회원가입 register에서 썼던 focus가 한 번이라도 되었는가? 에 대한 상태값
  const[touched, setTouched] = useState({
    extraEmail: false,
    nickname: false,
  })

  const [agreements, setAgreements] = useState({
    service: false,
    privacy: false,
    marketing: false,
  });

  const [termsList, setTermsList] = useState([]);

  const payload = {
    ...info,
    agreements: termsList.map(term => ({
      termsId: term.id,
      agreed: agreements[term.policyCode] || false
    }))
  };

  //최초 입력란에 마우스가 클릭 된 순간 작동하는 함수
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validation(name, value) }));
  };
  // Register Form에서 썼던 유효성 검증 고대로 복사
  const validation = (name, value) => {
    switch (name) {
      case "extraEmail":
        if (!value) return "추가 이메일은 필수입니다.";
        if (!/^(?!.*\s)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
          return "이메일은 공백이 없어야 하며, 올바른 형식이어야 합니다. ex) aaa@bbb.ccc 등";
        }
        break;
      case "nickname":
        if (!value) return "닉네임은 필수입니다.";
        if (!/^(?!.*\s)[가-힣a-zA-Z0-9 ]{2,16}$/.test(value)) { //끝에 공백 하나를 추가해서 공백도 포함하게 (구글 아이디는 저렇게 공백이 들어가 있는 경우가 많음)
          return "닉네임은 공백없이 한글, 영문, 숫자만 사용하여 2~16자까지 가능합니다.";
        }
        break;
      default:
        return "";
    }
    return "";
  }

  const socialChange = (e) => {
    const {name, value} = e.target
    e.preventDefault();
    setInfo({...info, [name]: value})
    //만약 한 번이라도 focus 되면 그 다음부터는 계속 touched 상태
    if (!touched[name]) {
      setTouched((prev) => ({...prev, [name]: true}));
    }
  }

  const extraEmailStatus = UseDuplicateCheck("email", info.extraEmail, "/member/check/email", validation);
  const nicknameStatus = UseDuplicateCheck("nickname", info.nickname, "/member/check/nickname", validation);

  // 유효성 검사, 중복체크에 통과하면, 버튼 활성화
  const isDisabled = Object.values(errors).some((e)=> e && e.length > 0) || extraEmailStatus !== "available" || nicknameStatus !== "available"
      || agreements.privacy === false || agreements.service === false;

  const submit = (e) => {
    if(!window.confirm("정말 제출하시겠습니까?")) return;
    console.log("payload:", payload);
    console.log("agreements:", payload.agreements);

    e.preventDefault();
    api.post("/social/auth/register", payload, {
      withCredentials : true
    }).then((resp) => {
      console.log("Content-type :", resp.headers[`content-type`])
      setMember({...info, provider})
      navigate(`/`);
    }
    ).catch((error) => {
      console.log("Error : ", error)
        }
    )
  }

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className={"bg-white shadow-lg rounded-2xl p-8 w-96"}>
          <div className={"mb-2 font-bold text-2xl"}>
            <span>가입이 거의 완료되었어요!</span>
          </div>
          <div className="mb-2 text-sm">
            <span>가입하시는 이메일: {info.email}</span>
          </div>
          {/* 추가 입력 폼 */}
          <div className="mb-2">
            <input type="text" name={"extraEmail"} placeholder="추가이메일" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                   onBlur={handleBlur} onChange={socialChange} />
          </div>
          {/* 에러 메시지 */}
          {touched.email && errors.email && (
              <ul className="mt-2 text-xs">
                <li className="text-red-500">{errors.email}</li>
              </ul>
          )}

          {/* 중복 검사 메시지 */}
          {touched.extraEmail && !errors.extraEmail && extraEmailStatus !== "idle" && info.email !== info.extraEmail && (
              <ul className="my-2 text-xs">
                <li className={extraEmailStatus === "available" ? "text-blue-500" : "text-red-500"}>
                  {extraEmailStatus === "available" ? "사용 가능한 이메일입니다." : "사용하실 수 없는 이메일입니다."}
                </li>
              </ul>
          )}
          {/* extraEmail과 email 중복 방지 */}
          {touched.extraEmail && !errors.extraEmail && info.email === info.extraEmail &&
              (<ul className={"mt-2 text-xs"}>
                <li className={"text-red-500"}>주 이메일과 동일한 이메일을 사용하실 수 없습니다.</li>
              </ul>)}
          <div className="mb-4">
            <input type="text" name={"nickname"} placeholder="닉네임" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                   onBlur={handleBlur} onChange={socialChange} value={info.nickname}/>
          </div>
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
          {/* 약관 동의 섹션 (제출 버튼 위) */}
          <TermsSection agreements={agreements} setAgreements={setAgreements} onTermsLoaded={setTermsList} />

          <div className="flex mt-3 gap-2">
            <button
                type="submit"
                className={`flex-1  text-white py-2 rounded-lg
                     ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-pink-300 hover:bg-pink-400 active:bg-pink-500 cursor-pointer" }`}
                disabled={isDisabled} onClick={submit}>
              제출하기
            </button>
          </div>
        </div>
      </div>
  );
}
