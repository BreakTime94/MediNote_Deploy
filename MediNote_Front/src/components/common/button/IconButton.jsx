import React from "react";

export default function IconButton({
                                       children,
                                       onClick,
                                       className = "",
                                       ariaLabel = "icon button",
                                       ...rest
                                   }) {
    const baseClasses = "inline-flex items-center justify-center w-11 h-11 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2";

    return (
        <button
            type="button"
            aria-label={ariaLabel}
            onClick={onClick}
            className={`${baseClasses} ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
}