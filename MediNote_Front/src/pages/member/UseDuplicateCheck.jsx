import {useEffect, useRef, useState} from "react";
import api from "../../components/common/api/axiosInterceptor.js";

//이메일, 추가이메일, 닉네임 중복검사를 위한 함수
function UseDuplicateCheck (fieldName, value, apiUrl, validationFn)  {
  //function 내 state
  // 이메일, 추가이메일, 닉네임 중복검사를 위한 상태관리 idle, checking, available, taken (4개 값으로 관리)
  const [duplicationCheck, setDuplicationCheck] = useState("idle")

  // 이전 값 저장용 ref (blur로 같은 값 다시 들어와도 skip)
  const prevValueRef = useRef("");

  useEffect(() => {
    if(prevValueRef === value) return ;
    prevValueRef.current = value;

    const error = validationFn(fieldName, value)

    if(error || !value) {
      setDuplicationCheck("idle")
      return;
    }

    const timer = setTimeout(() => {
      api.get(apiUrl, {
        params: {[fieldName] : value}
      })
          .then((resp) => {
            setDuplicationCheck(resp.data.available ? "available" : "taken")
          })
          .catch((error) => {
            console.error(`${fieldName} 중복검사 실패:`, error);
            setDuplicationCheck('idle');
          })
    }, 500)

    return () => clearTimeout(timer);
  }, [value]); //실제로는 value만 바뀜, 허나 공식 리액트 권장사항은 의존성 배열을 다 넣는 것이다.
  return duplicationCheck;
};

export default UseDuplicateCheck;