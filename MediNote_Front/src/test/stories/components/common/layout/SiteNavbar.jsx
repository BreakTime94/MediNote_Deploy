import React from "react";
import NavbarMenu from "./NavbarMenu.jsx";
import { navItems } from "./navbar.data.js";

function SiteNavbar() {
    return (
        <nav className="w-full border-b bg-white shadow-sm z-50 sticky top-0">
            <div className="container mx-auto">
                <NavbarMenu items={navItems} align="center" className="min-h-[60px]" />
            </div>
        </nav>
    );
}

export default SiteNavbar;