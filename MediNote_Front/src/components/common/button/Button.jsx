import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import Spinner from "../spinner/Spinner.jsx";

const base =
    "inline-flex items-center justify-center select-none transition-colors cursor-pointer " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "disabled:cursor-not-allowed disabled:opacity-100 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200";

const variants = {
    white: clsx(
        "bg-[var(--color-bg)] text-[var(--text-strong)] shadow-sm",
        "border border-[0.5px] border-[var(--border-soft)]",
        "hover:bg-[var(--white-hover)] focus-visible:ring-[var(--focus-ring)]"
    ),
    gradient: clsx(
        "text-white shadow-sm bg-grad-main",
        "hover:brightness-105 focus-visible:ring-[var(--focus-ring)]"
    ),
};

const sizes = {
    sm: "h-8 px-3 text-sm gap-1.5",
    md: "h-10 px-4 gap-2",
    lg: "h-12 px-5 gap-2.5",
};

const radii = {
    md: "rounded-md",
    lg: "rounded-lg",
    pill: "rounded-full",
};

export const Button = forwardRef(
    (
        {
            variant = "white",
            size = "md",
            radius = "pill",
            fullWidth = false,
            leftIcon,
            rightIcon,
            loading = false,
            disabled = false,
            className,
            children,
            ...rest
        },
        ref
    ) => {
        const isDisabled = disabled || loading;

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                aria-disabled={isDisabled || undefined}
                aria-busy={loading || undefined}
                className={twMerge(
                    base,
                    variants[variant],
                    sizes[size],
                    radii[radius],
                    fullWidth && "w-full",
                    className
                )}
                {...rest}
            >
                {loading && (
                    <Spinner
                        size={16}
                        className={children ? "mr-1" : ""}
                        ariaLabel="Loading"
                    />
                )}
                {leftIcon && <span className="-ml-0.5">{leftIcon}</span>}
                <span>{children}</span>
                {rightIcon && <span className="-mr-0.5">{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = "Button";
