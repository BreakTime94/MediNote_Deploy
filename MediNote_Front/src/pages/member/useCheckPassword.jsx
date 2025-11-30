import {useState, useEffect} from "react"
import api from "../../components/common/api/axiosInterceptor.js"

export default function useCheckPassword(password, delay = 500) {

  // 사용자의 입력값을 일정 시간 동안 묵혀두는 디바운스용 값
  const [debouncedValue, setDebouncedValue] = useState(password);

  // 비밀번호가 서버 검증에서 유효한지 여부
  const [valid, setValid] = useState(false);

  // 서버 요청 중 로딩 상태
  const [loading, setLoading] = useState(false);

  // 서버에서 받은 에러 메시지 (또는 검증 실패 메시지)
  const [error, setError] = useState("");

  // 1. 디바운스 로직
  // 사용자가 입력을 멈춘 뒤 delay(ms) 후에만 서버 검증을 실행.
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(password), delay);
    return () => clearTimeout(handler);
    // useEffect의 return은 이 useEffect가 다시 실행될때 제일먼저 실행할 함수를 반환한다 () => clearTimeout(handelr) 이 함수를 통으로 반환하여 실행시킨다.
    // 즉, 새로운 입력이 생겨서 debounce를 새로 입력하면 setTimeout을 하기전에 그 전에 입력해놓은 handler를 clear 시킨다.
  }, [password, delay]);

  // 2. 서버 비밀번호 검증 요청
  useEffect(() => {
    if (!debouncedValue) return; // 값이 없으면 요청하지 않음

    setLoading(true);
    setError("");

    api.post("/member/check/password", { password: debouncedValue })
        .then((resp) => {
          // 서버가 "VALID_PASSWORD"로 응답하면 성공
          if (resp.data.available === true) {
            setValid(true);
            setError("");
          } else {
            // 응답은 왔지만 비밀번호 불일치
            setValid(false);
            setError("비밀번호가 일치하지 않습니다.");
          }
        })
        .catch(() => {
          // 서버 오류나 기타 예외 상황
          setValid(false);
          setError("서버 오류 또는 비밀번호 불일치");
        })
        .finally(() => {
          setLoading(false); // 로딩 종료
        });
  }, [debouncedValue]);

  /**
   * valid: 서버에서 비밀번호 일치로 판정되었는지 여부
   * loading: 검증 요청이 진행 중인지 여부
   * error: 실패 시 사용자에게 보여줄 메시지
   */
  return { valid, loading, error };
}