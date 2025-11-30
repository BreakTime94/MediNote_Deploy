import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useState, useRef } from "react";

function NavBar(props) {
    const {
        items = [],
        align = "center",
        className = "",
        gap = "gap-0",
    } = props;

    const [activeDropdown, setActiveDropdown] = useState(null);
    const closeTimeoutRef = useRef(null);

    const handleMouseEnter = (index) => {
        clearTimeout(closeTimeoutRef.current);
        setActiveDropdown(index);
    };

    const handleMouseLeave = () => {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 200);
    };

    const navClass = clsx(
        "flex items-center w-full",
        gap,
        {
            "justify-start": align === "left",
            "justify-center": align === "center",
            "justify-end": align === "right",
        },
        className
    );

    return (
        <nav className={navClass} role="navigation" aria-label="메인 네비게이션">
            {items.map((item, index) => (
                <NavItem
                    key={item.id ?? `nav-${index}`}            // ✅ 고유 id 사용
                    item={item}
                    index={index}
                    isActive={activeDropdown === index}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                />
            ))}
        </nav>
    );
}

function NavItem({
                     item,
                     index,
                     isActive,
                     onMouseEnter,
                     onMouseLeave,
                 }) {
    const {
        id,
        label,
        path = "#",
        children = [],
        icon: Icon,
        disabled = false,
        target,
        rel,
    } = item;

    const hasChildren = children.length > 0 && !disabled;

    return (
        <div
            className="relative flex-1 flex justify-center"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <NavLink
                to={path}
                className={({ isActive: isRouteActive }) =>
                    clsx(
                        "block px-4 py-3 mx-2 text-sm font-medium transition-all duration-200 rounded-lg",
                        "hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900",
                        disabled && "pointer-events-none opacity-50",
                        isRouteActive ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    )
                }
                target={target}
                rel={rel}
                aria-haspopup={hasChildren}
                aria-expanded={hasChildren ? isActive : undefined}
            >
                <div className="flex items-center justify-center">
                    {Icon ? <Icon className="mr-1 inline-block" size={16} /> : null}
                    {label}
                </div>
            </NavLink>

            {hasChildren && isActive && (
                <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 z-50 mt-2 min-w-48 bg-white border border-gray-200 rounded-xl shadow-lg"
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    <div className="py-3 px-2">
                        <div className="space-y-1">
                            {children.map((child, j) => (
                                <NavLink
                                    key={child.id ?? `nav-${id ?? index}-${j}`}   // ✅ 자식도 고유 id 사용
                                    to={child.path}
                                    target={child.target}
                                    rel={child.rel}
                                    className={({ isActive: isRouteActive }) =>
                                        clsx(
                                            "block rounded-lg px-4 py-2 text-sm transition-colors duration-150",
                                            "hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900",
                                            isRouteActive
                                                ? "bg-blue-50 text-blue-700 font-medium"
                                                : "text-gray-600"
                                        )
                                    }
                                >
                                    {child.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NavBar;
