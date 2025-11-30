import toast from "react-hot-toast";
import ToastCard from "./ToastCard.jsx";

const DUR = {
    success: 2500, error: 6000, warning: 5000, info: 3000,
    loading: Infinity, action: 7000, offline: Infinity,
    copied: 1500, formerr: 5000, perm: 5000,
};

const showCard = (type, props, extra = {}) =>
    toast.custom((t) => <ToastCard {...props} t={t} type={type} />, {
        duration: DUR[type],
        ...extra,
    });

export const show = {
    success: (p) => showCard("success", p),
    error:   (p) => showCard("error", p),
    warning: (p) => showCard("warning", p),
    info:    (p) => showCard("info", p),
    loading: (p) => showCard("loading", p),
    action:  (p) => showCard("action", p),
    offline: (p) => showCard("offline", p),
    copied:  (p) => showCard("copied", p),
    formerr: (p) => showCard("formerr", p),
    perm:    (p) => showCard("perm", p),

    // 🔄 커스텀 promise: 같은 id로 상태 업데이트해 동일 카드/아이콘 사용
    promise: (promise, msgs = {}) => {
        const id = `p:${Date.now()}`;
        showCard("loading", { title: msgs.loading ?? "처리중..." }, { id });

        promise
            .then((res) => {
                showCard("success", {
                    title: msgs.success ?? (res?.message || "완료되었습니다."),
                }, { id, duration: DUR.success });
                return res;
            })
            .catch((err) => {
                showCard("error", {
                    title: msgs.error ?? (err?.message || "실패했습니다."),
                }, { id, duration: DUR.error });
                // 필요하면 rethrow
            });

        return promise;
    },

    once: (key, type, p) => {
        toast.dismiss(key);
        showCard(type, p, { id: key, duration: DUR[type] });
    },
};