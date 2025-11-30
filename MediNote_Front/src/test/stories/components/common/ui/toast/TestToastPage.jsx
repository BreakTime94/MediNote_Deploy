import React from "react";
import { ToastCard } from "./index.jsx";
import { show } from "./commonToast.jsx"

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export default function TestToastPage() {
    const doPromiseSuccess = () =>
        show.promise(
            (async () => {
                await sleep(1200);
                return { ok: true };
            })(),
            { loading: "등록 중...", success: "등록이 완료되었습니다.", error: "등록 실패" }
        );

    const doPromiseError = () =>
        show.promise(
            (async () => {
                await sleep(1200);
                throw new Error("서버 오류(500)");
            })(),
            { loading: "처리 중...", success: "완료", error: "실패했습니다." }
        );

    const buttons = [
        { label: "Success", onClick: () => show.success({ title: "저장 완료", desc: "설정이 업데이트되었습니다." }) },
        {
            label: "Error",
            onClick: () =>
                show.error({
                    title: "삭제 실패",
                    desc: "권한이 없습니다.",
                    supportId: "ERR-9F2C",
                    actionLabel: "자세히",
                    onAction: () => alert("오류 상세 보기"),
                }),
        },
        { label: "Warning", onClick: () => show.warning({ title: "만료 예정", desc: "D-2: 플랜이 곧 만료됩니다." }) },
        { label: "Info", onClick: () => show.info({ title: "공지", desc: "새로운 기능이 출시되었습니다." }) },
        { label: "Loading", onClick: () => show.loading({ title: "업로드 중..." }) },
        {
            label: "Action(Undo)",
            onClick: () => show.action({ title: "항목이 삭제되었습니다.", actionLabel: "되돌리기", onAction: () => alert("되돌림!") }),
        },
        {
            label: "Offline/Session",
            onClick: () =>
                show.offline({
                    title: "오프라인 감지",
                    desc: "네트워크를 확인한 뒤 재시도하세요.",
                    actionLabel: "재시도",
                    onAction: () => location.reload(),
                }),
        },
        { label: "Copied", onClick: () => show.copied({ title: "복사됨" }) },
        { label: "Form Error", onClick: () => show.formerr({ title: "제출 실패", desc: "이름, 이메일을 입력하세요." }) },
        { label: "Permission", onClick: () => show.perm({ title: "권한 필요", actionLabel: "설정 열기", onAction: () => alert("브라우저 설정 열기") }) },
        { label: "Promise ✓", onClick: doPromiseSuccess },
        { label: "Promise ✕", onClick: doPromiseError },
    ];

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-3">Toast Variants</h1>
            <div className="flex flex-wrap gap-2 max-w-[720px]">
                {buttons.map((b) => (
                    <button
                        key={b.label}
                        className="px-3 py-1 rounded bg-zinc-800 text-white hover:opacity-90"
                        onClick={b.onClick}
                    >
                        {b.label}
                    </button>
                ))}
                <div className="w-full text-xs opacity-60 mt-2">
                    * Loading/Offline은 수동으로 닫거나 상태 변화로 마감됩니다.
                </div>
            </div>
        </div>
    );
}