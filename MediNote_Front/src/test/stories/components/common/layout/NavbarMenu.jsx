import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useState, useRef } from "react";

/**
 * props:
 *  - items: navItems 배열
 *  - align: "left" | "center" | "right"
 *  - className, gap: 추가 스타일
 */
function NavbarMenu({ items = [], align = "center", className = "", gap = "gap-0" }) {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const navRef = useRef(null);

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
        <nav ref={navRef} className={navClass} role="navigation" aria-label="메인 네비게이션">
            {items.map((item, index) => (
                <NavItem
                    key={item.path ?? item.label}
                    item={item}
                    index={index}
                    isActive={activeDropdown === index}
                    onMouseEnter={() => setActiveDropdown(index)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    onFocus={() => setActiveDropdown(index)}
                    onBlur={(e) => {
                        setTimeout(() => {
                            const currentTarget = e.currentTarget;
                            if (!currentTarget.contains(document.activeElement)) {
                                setActiveDropdown(null);
                            }
                        }, 0);
                    }}
                />
            ))}
        </nav>
    );
}

function NavItem({ item, isActive, onMouseEnter, onMouseLeave, onFocus, onBlur }) {
    const {
        label,
        path = "#",
        children = [],
        icon: Icon,
        disabled = false,
        target,
        rel,
    } = item;

    const parentClass = ({ isActive: isRouteActive }) =>
        clsx(
            "block px-4 py-3 mx-2 text-sm font-medium transition-all duration-200 rounded-lg",
            "hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900",
            disabled && "pointer-events-none opacity-50",
            isRouteActive ? "bg-gray-100 text-gray-900" : "text-gray-700"
        );

    const hasChildren = children.length > 0 && !disabled;

    return (
        <div
            className="relative flex-1 flex justify-center"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onFocus={onFocus}
            onBlur={onBlur}
        >
            <NavLink
                to={path}
                className={parentClass}
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
                <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-2 min-w-48 bg-white border border-gray-200 rounded-xl shadow-lg">
                    <div className="py-4 px-2">
                        <div className="space-y-1">
                            {children.map((child) => {
                                const { label: cLabel, path: cPath = "#", target: cTarget, rel: cRel } = child;
                                return (
                                    <NavLink
                                        key={cPath}
                                        to={cPath}
                                        target={cTarget}
                                        rel={cRel}
                                        className={({ isActive: isRouteActive }) =>
                                            clsx(
                                                "block rounded-lg px-4 py-2 text-sm transition-colors duration-150",
                                                "hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900",
                                                isRouteActive ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600"
                                            )
                                        }
                                    >
                                        {cLabel}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NavbarMenu;