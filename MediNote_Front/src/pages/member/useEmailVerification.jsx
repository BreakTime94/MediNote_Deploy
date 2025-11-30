import { useState } from "react";
import api from "../../components/common/api/axiosInterceptor.js";
import { useEmailTimer } from "./useEmailTimer";
import {show} from "@/test/stories/components/common/ui/toast/commonToast.jsx";

export function useEmailVerification() {
  const [verificationCode, setVerificationCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const { leftTime, startTimer, formatTime, stopTimer } = useEmailTimer();

  // 인증메일 요청 (then/catch)
  const sendCode = (email, type) => {
    api
        .post("/member/email/send", {
          "email": email,
          "type": type,
        })
        .then((resp) => {
          show.success({
            title: resp.data.message,
            desc: resp.data.desc,
          });
          startTimer();
          setShowCodeInput(true);
        })
        .catch(() => {
          show.error({
            title: "인증 메일 발송 실패",
            desc: "잠시 후 다시 시도해주세요.",
          });
        });
  };

  // 인증코드 확인 (then/catch)
  const verifyCode = (email, verification, setVerification, type) => {
    api
        .post("/member/email/verify", {
          email: email,
          code: verificationCode,
          type: type
        })
        .then((res) => {
          if (res.data.available === true) {
            show.success({ title: res.data.message });
            setVerification(true);
            setShowCodeInput(false);
            stopTimer();
          } else {
            show.formerr({ title: "인증 코드가 올바르지 않습니다." });
          }
        })
        .catch(() => {
          show.error({
            title: "인증 확인 중 오류가 발생했습니다.",
          });
        });
  };

  return {
    verificationCode,
    setVerificationCode,
    showCodeInput,
    setShowCodeInput,
    sendCode,
    verifyCode,
    leftTime,
    formatTime,
    stopTimer,
  };
}
