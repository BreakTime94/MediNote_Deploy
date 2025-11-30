import React, {useEffect, useState} from "react";
import axios from "axios";
import LogoutButton from "./LogoutButton.jsx";
import {useNavigate} from "react-router-dom";
import api from "./axiosInterceptor.js";
import ExtraEmailVerification from "./ExtraEmailVerification.jsx";
import UseDuplicateCheck from "./UseDuplicateCheck.jsx";
import {show} from "../common/ui/toast/commonToast.jsx";

function TestMyPage() {
  const [memberDto, setMemberDto] = useState({
    email: "",
    nickname: "",
    extraEmail: "",
    profileImagePath: "",
    extraEmailVerified: null,
    regDate: "",
  });

  const[newMemberDto, setNewMemberDto] = useState({
    extraEmail: "",
    nickname: "",
    profileImagePath: "",
    profileMimeType: "",
    extraEmailVerified: null,
  })
  //인증여부
  const [verification, setVerification] = useState(false);

  //최초 focus 여부
  const[touched, setTouched] = useState({
    extraEmail: false,
    nickname: false,
  })
  //유효성 검사 실패내용 담음
  const [errors, setErrors] = useState({});

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validation(name, value) }));
  };

  const [valueChange, setValueChange] = useState(false);

  const validation = (name, value) => {
    switch (name) {
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

  const extraEmailStatus = UseDuplicateCheck("email", newMemberDto.extraEmail, "/member/check/email", validation);
  const nicknameStatus = UseDuplicateCheck("nickname", newMemberDto.nickname, "/member/check/nickname", validation);

  //라우터 이동
  const navigate = useNavigate();

  //처음 Mypage로 값 가져오는 것
  useEffect(() => {
    axios.get("/api/member/get", {
      withCredentials: true
    })
        .then((res) => {
          console.log("Content-Type", res.headers["content-type"])
          console.log("로그인 된 멤버 정보", res.data)
          setMemberDto(res.data)
          setNewMemberDto(res.data)
        })
        .catch((error) => {
          console.log("error : ", error)
        })
  }, []);

  useEffect(()=> {
    const changed = newMemberDto.extraEmail !== memberDto.extraEmail || newMemberDto.nickname !== memberDto.nickname || newMemberDto.profileImagePath !== memberDto.profileImagePath;
    setValueChange(changed);
  },[newMemberDto])

  const logout = (e) => {
    e.preventDefault()

    axios.post("/api/member/auth/logout", {} ,{
      withCredentials: true
    }).then(() => {
      console.log("로그아웃 성공했습니다.");
      navigate("/member")
    }).catch((error) => {
      console.log("error : ", error);
    })
  }

  const change = (e) => {
    const {name, value} = e.target;
    setNewMemberDto((prev) => ({...prev, [name]: value}))
    setErrors((prev) => ({ ...prev, [name]: validation(name, value) }));
  }

  const updateMember = (e) => {
    e.preventDefault();
    axios.patch("api/member/modify", newMemberDto)
        .then((resp) => {
          console.log(resp);
          setValueChange(false)
          navigate("/member/mypage")
        })
        .catch((err)=> {
          console.log(err);
        })
  }

  const withdraw = (e) => {
    e.preventDefault();
    api.delete("/member/remove",{
     data: {email: memberDto.email}
    }).then((resp) => {
      console.log(resp);
      navigate(`/member`);
    }).catch((err) => {
      show.error(
          {title: "오류가 발생하였습니다."}
      )
    })
  }

  const isDisabled= Object.values(errors).some((e)=> e.length > 0) || extraEmailStatus !== "available" || nicknameStatus !== "available" || !valueChange;

  return(
      <>
        {memberDto &&
        <div className={"flex items-center justify-center min-h-screen"}>
          <div className={"gap-2 w-96 border-1"}>
            <div className={"m-2"}>
              <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
              <input className={"border w-full"} name={"email"} id={"email"} value={memberDto.email} readOnly={true}/>
            </div>
            <div className={"m-2"}>
              <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
              <input className={"border w-full"} name={"nickname"} id={"nickname"} value={newMemberDto.nickname} onChange={change} onBlur={handleBlur}/>
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
            <ExtraEmailVerification member={newMemberDto} setMember={setNewMemberDto} touched={touched} errors={errors} emailStatus={extraEmailStatus} handleBlur={handleBlur}
            change={change} verification={verification} setVerification={setVerification}/>
            <div className={"m-2"}>
              <label className="block text-sm font-medium text-gray-700 mb-1">프로필이미지</label>
              <input className={"border w-full"} name={"profileImagePath"} value={newMemberDto.profileImagePath || "이미지가 없습니다."} readOnly={true}/>
            </div>
            <div className={"m-2"}>
              <label className="block text-sm font-medium text-gray-700 mb-1">계정등록일</label>
              <input className={"border w-full"} name={"regDate"} value={memberDto.regDate} readOnly={true}/>
            </div>
            <div className={"m-2 text-sm"}>
              <LogoutButton children = {"로그아웃"} onClick={logout} />
              <button type={"button"} className={ isDisabled === false ? "flex-1 bg-purple-300 text-gray-700 px-2 py-1 rounded-lg shadow hover:bg-purple-400 active:bg-purple-500 cursor-pointer" :
              "flex-1 bg-gray-300 text-amber-50 px-2 py-1 rounded-lg shadow mx-3"}
                      onClick={updateMember} disabled={isDisabled}>
                수정하기
              </button>
              <button type={"button"} className={"flex-1 bg-red-300 text-black px-2 py-1 rounded-lg shadow hover:bg-red-500 hover:font-bold cursor-pointer"}
              onClick={withdraw}>
                계정 탈퇴하기
              </button>
              <button type={"button"} className={"flex-1 bg-blue-300 text-white px-2 py-1 rounded-lg shadow hover:bg-blue-500 hover:font-bold cursor-pointer"}
              onClick={ () => navigate("/member/mypage/changepassword")}>
                비밀번호 변경
              </button>
            </div>
          </div>
        </div>
        }
      </>
  );
}
export default TestMyPage