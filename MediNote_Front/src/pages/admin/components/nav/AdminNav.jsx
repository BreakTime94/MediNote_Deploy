
import React from "react";
import { AdminNavData } from "./adminNavData.js";
import AdminNavBar from "./AdminNavBar.jsx";

function AdminNav() {
    return (
        <nav className="w-full border-b border-gray-300 bg-white  z-50 sticky top-0">
            <div className="container mx-auto">
                <AdminNavBar
                    items={AdminNavData}
                    align="center"
                    className="min-h-[60px]"
                />
            </div>
        </nav>
    );
}

export default AdminNav;