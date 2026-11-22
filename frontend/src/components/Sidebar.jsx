
import {
    LayoutDashboard,
    CheckSquare,
    User,
    Settings,
    CalendarDays,
    BarChart3,
    X
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
    const menuItems = [
        {
            title: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard
        },
        {
            title: "My Tasks",
            path: "/tasks",
            icon: CheckSquare
        },
        {
            title: "Calendar",
            path: "/calendar",
            icon: CalendarDays
        },
        {
            title: "Analytics",
            path: "/analytics",
            icon: BarChart3
        },
        {
            title: "Profile",
            path: "/profile",
            icon: User
        },
        {
            title: "Settings",
            path: "/settings",
            icon: Settings
        }
    ];

    return (
        <>
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                />
            )}

            <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>

                <div className="sidebar-header">
                    <h2 className="brand">TaskFlow</h2>

                    <button
                        className="mobile-close"
                        onClick={onClose}
                        type="button"
                    >
                        <X />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    isActive ? "active" : ""
                                }
                            >
                                <Icon size={20} />
                                <span>{item.title}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    Task Manager v1.0
                </div>

            </aside>
        </>
    );
}

export default Sidebar;
