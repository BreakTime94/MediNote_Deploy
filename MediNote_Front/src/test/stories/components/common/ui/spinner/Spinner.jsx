import React from "react";
import {twMerge} from "tailwind-merge";
import clsx from "clsx";

/**
 * 재사용 스피너
 * - size: px 숫자 또는 Tailwind 클래스(예: "h-5 w-5")
 * - thickness: 선 두께 (기본 4)
 * - ariaLabel: 접근성 라벨
 */

export default function Spinner({
                                    size = 16,
                                    thickness = 4,
                                    className,
                                    ariaLabel = "Loading",
}) {
    const numeric = typeof size === "number";
    const box = numeric ? { width: size, height: size } : {};
    const sizeClass = numeric ? "" : size; // "h-5 w-5" 같은 Tailwind class 허용
    return (
        <span
            role="status"
            aria-live="polite"
            aria-label={ariaLabel}
            className={twMerge("inline-flex items-center justify-center", className)}
            style={box}
        >
      <svg
          className={clsx("animate-spin")}
          viewBox="0 0 24 24"
          width={numeric ? size : undefined}
          height={numeric ? size : undefined}
          aria-hidden="true"
      >
        <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth={thickness}
            fill="none"
            opacity="0.25"
        />
        <path
            d="M22 12a10 10 0 0 1-10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth={thickness}
        />
      </svg>
            {/* Tailwind 크기 문자열을 쓴 경우 SVG 래퍼 크기도 맞춰줌 */}
            {sizeClass && <span className={sizeClass} aria-hidden="true" />}
    </span>
    );
}