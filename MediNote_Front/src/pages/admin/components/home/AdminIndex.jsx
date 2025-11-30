import React, {useState} from "react";
import api from "@/components/common/api/axiosInterceptor.js";
import {useNavigate} from "react-router-dom";
import {useAuthStore} from "@/components/common/hooks/useAuthStore.jsx";

function AdminIndex(){
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    email: "",
    password: "",
  });
  const {setMember} = useAuthStore();

  const handleChange = (e) => {
    const{name, value} = e.target // const email = email.value, const password = password.value
    setAdmin({...admin, [name]: value});
  }
  const login = () => {
    api.post("/member/auth/login", admin)
        .then((resp)=> {
          console.log(resp.data);
          console.log(resp.data.member.role);
          if(resp.data.member.role === "ADMIN") {
            navigate("/admin/main")
            setMember(resp.data.member);
          } else {
            window.alert("권한이 없습니다. 관리자에게 문의하여 주시기 바랍니다.")
            navigate("/admin")
          }
        })
        .catch((error)=> {
          window.alert(error.response.data.message)
        })
  }
    return(
        <div className="min-h-screen flex flex-col justify-center items-center bg-white">
          <div className="shadow-lg rounded-2xl border p-8 w-96">
            <div className={"text-center font-bold"}>
              Medinote Admin 페이지
            </div>
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
            <div className="flex gap-2 mt-4">
              <button
                  type="button"
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg
                     hover:bg-gray-600 active:bg-gray-700 cursor-pointer"
                  onClick={login}
              >
                로그인
              </button>
            </div>
          </div>
        </div>
    );
}

export default AdminIndex;