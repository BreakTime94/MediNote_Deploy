function LogoutButton(props) {
    const { children, onClick, isGradient = false, className = "", ...rest } = props;

    const baseClasses = "px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[40px] inline-flex items-center justify-center";

    const gradientClasses = isGradient
        ? "bg-gradient-to-r from-[#ff9bd4] to-[#c89cff] text-white hover:from-[#ff85ca] hover:to-[#b584ff] focus:ring-[#c89cff] focus:ring-opacity-50 shadow-sm"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-300";

    const buttonClassName = `${baseClasses} ${gradientClasses} ${className}`;

    return (
        <button
            className={buttonClassName}
            onClick={onClick}
            {...rest}
        >
            {children}
        </button>
    );
}

export default LogoutButton;