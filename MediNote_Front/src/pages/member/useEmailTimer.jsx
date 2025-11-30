import {useState, useRef} from "react";

export const useEmailTimer = () => {
  //전체 시간 상태값 보관
  const [leftTime, setLeftTime] = useState(300)
//setInterval이 반환해주는 number값 저장용(렌더링이 일어나도 값 변환x)
  const timerId = useRef(null);

  const startTimer = () => {
    if(timerId.current) {
      clearInterval(timerId.current);
      setLeftTime(300);
    }
    timerId.current = setInterval(() => {
      setLeftTime((prev) => {
        if(prev <= 1) {
          clearInterval(timerId.current)
          return 0;
        }
        return prev - 1;
      })
    }, 1000)
  }
//시간 format 용
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60); //자바랑 다르게 몀확하게 버림이 필요함
    const sec = seconds % 60;
    //String은 문자열 명시 변환 60 + "" => "60"와 동일, padStart는 첫번째 인수는 자릿수, 두번째는 부족한 자릿수를 채울 문자다.
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  //interval 초기화
  const stopTimer = () => {
    if(timerId.current) {
      clearInterval(timerId.current);
      timerId.current = null;
    }
  }

  return {leftTime, startTimer, formatTime, stopTimer};
}