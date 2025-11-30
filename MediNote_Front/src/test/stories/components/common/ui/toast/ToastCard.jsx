import { X } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";
import {
    CircleCheckBig, CircleX, TriangleAlert, Info, Loader2,
    Undo2, WifiOff, ClipboardCheck, FileWarning, LockKeyhole,
} from "lucide-react";

export default function ToastCard({
                                      type = "info",
                                      title,
                                      desc,
                                      supportId,
                                      actionLabel,
                                      onAction,
                                      t, // react-hot-toast가 제공하는 핸들
                                  }) {
    const handleClose = (e) => {
        e.preventDefault();
        toast.remove(t.id);
        // toast.dismiss(t.id);
    };

  const tone =
      ({
        success: "bg-emerald-500 text-white border-emerald-600 dark:bg-emerald-600 dark:text-white dark:border-emerald-700",
        error:   "bg-rose-500 text-white border-rose-600 dark:bg-rose-600 dark:text-white dark:border-rose-700",
        warning: "bg-amber-500 text-white border-amber-600 dark:bg-amber-600 dark:text-white dark:border-amber-700",
        info:    "bg-sky-500 text-white border-sky-600 dark:bg-sky-600 dark:text-white dark:border-sky-700",
        loading: "bg-zinc-500 text-white border-zinc-600 dark:bg-zinc-600 dark:text-white dark:border-zinc-700",
        action:  "bg-indigo-500 text-white border-indigo-600 dark:bg-indigo-600 dark:text-white dark:border-indigo-700",
        offline: "bg-zinc-600 text-white border-zinc-700 dark:bg-zinc-700 dark:text-white dark:border-zinc-800",
        copied:  "bg-sky-500 text-white border-sky-600 dark:bg-sky-600 dark:text-white dark:border-sky-700",
        formerr: "bg-rose-500 text-white border-rose-600 dark:bg-rose-600 dark:text-white dark:border-rose-700",
        perm:    "bg-purple-500 text-white border-purple-600 dark:bg-purple-600 dark:text-white dark:border-purple-700",
      }[type]) ?? "bg-sky-500 text-white border-sky-600";

    const Icon = (
        {
            success: <CircleCheckBig className="w-4 h-4" />,
            error:   <CircleX className="w-4 h-4" />,
            warning: <TriangleAlert className="w-4 h-4" />,
            info:    <Info className="w-4 h-4" />,
            loading: <Loader2 className="w-4 h-4 animate-spin" />,
            action:  <Undo2 className="w-4 h-4" />,
            offline: <WifiOff className="w-4 h-4" />,
            copied:  <ClipboardCheck className="w-4 h-4" />,
            formerr: <FileWarning className="w-4 h-4" />,
            perm:    <LockKeyhole className="w-4 h-4" />,
        }[type] ?? <Info className="w-4 h-4" />
    );

    const handleAction = (e) => {
        e.preventDefault();
        try {
            onAction?.();
        } finally {
            toast.dismiss(t.id);
        }
    };

    return (
        <div
            className={clsx("flex items-start gap-3 p-4 max-w-96 border rounded-2xl", tone)}
            role="status"
            aria-live="polite"
        >
            <div className={clsx("mt-0.5", type === "loading" && "animate-pulse")} aria-hidden={true}>
                {Icon}
            </div>

            <div className="flex-1">
                {title && <div className="text-sm leading-5 font-medium">{title}</div>}
                {desc && <div className="text-xs leading-5 opacity-80 mt-0.5">{desc}</div>}
                {supportId && type === "error" && (
                    <div className="text-[11px] opacity-60 mt-1">지원 코드: {supportId}</div>
                )}

                {actionLabel && onAction && (
                    <button
                        type="button"
                        className="text-xs font-medium underline underline-offset-2 mt-2"
                        onClick={handleAction}
                    >
                        {actionLabel}
                    </button>
                )}
            </div>

            <button
                type="button"
                className="opacity-70 hover:opacity-100"
                onClick={handleClose}
                aria-label="닫기"
            >
                <X className="w-4 h-4" aria-hidden="true" />
            </button>
        </div>
    );
}