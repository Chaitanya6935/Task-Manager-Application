
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    Search,
    Bell,
    Menu,
    AlertCircle,
    CalendarClock,
    Check,
    CheckCheck,
    X
} from "lucide-react";

function Topbar({
                    onMenuClick,
                    notifications: notificationList = [],
                    onMarkAsRead,
                    onMarkAllAsRead,
                    searchTerm = "",
                    onSearchChange
                }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const getInitials = (name) => {
        if (!name) return "U";

        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((word) => word.charAt(0).toUpperCase())
            .join("");
    };

    const notifications = Array.isArray(notificationList)
        ? notificationList
        : [];

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    const handleSearchToggle = () => {
        setShowSearch((previous) => !previous);
        setShowNotifications(false);
    };

    return (
        <header className="topbar">

            <button
                className="mobile-menu"
                type="button"
                onClick={onMenuClick}
                aria-label="Open navigation menu"
            >
                <Menu size={22} />
            </button>

            <div className="topbar-heading">
                <h2>My Workspace</h2>
                <p>Manage your daily productivity</p>
            </div>

            <div className="top-actions">



                {/* NOTIFICATIONS */}
                <div className="notification-wrapper">

                    <button
                        className="icon-button notification-button"
                        type="button"
                        onClick={() => {
                            setShowNotifications((previous) => !previous);
                            setShowSearch(false);
                        }}
                        aria-label="Notifications"
                    >
                        <Bell />

                        {unreadCount > 0 && (
                            <span className="notification-badge">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="notification-dropdown">

                            <div className="notification-header">
                                <h3>Notifications</h3>
                                <span>{unreadCount} unread</span>
                            </div>

                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    className="mark-all-read-btn"
                                    onClick={onMarkAllAsRead}
                                >
                                    <CheckCheck size={15} />
                                    Mark all as read
                                </button>
                            )}

                            {notifications.length === 0 ? (
                                <p className="no-notifications">
                                    You're all caught up!
                                </p>
                            ) : (
                                <div className="notification-list">

                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`notification-item ${
                                                notification.read
                                                    ? "read"
                                                    : "unread"
                                            }`}
                                        >
                                            {notification.type === "OVERDUE" ? (
                                                <AlertCircle
                                                    size={20}
                                                    className="overdue-icon"
                                                />
                                            ) : (
                                                <CalendarClock
                                                    size={20}
                                                    className="upcoming-icon"
                                                />
                                            )}

                                            <div className="notification-content">

                                                <strong>
                                                    {notification.title}
                                                </strong>

                                                <p>
                                                    {notification.message}
                                                </p>

                                                {!notification.read && (
                                                    <button
                                                        type="button"
                                                        className="mark-read-btn"
                                                        onClick={() =>
                                                            onMarkAsRead?.(
                                                                notification.id
                                                            )
                                                        }
                                                    >
                                                        <Check size={14} />
                                                        Mark as read
                                                    </button>
                                                )}

                                                {notification.read && (
                                                    <span className="read-label">
                                                        Read
                                                    </span>
                                                )}

                                            </div>
                                        </div>
                                    ))}

                                </div>
                            )}

                        </div>
                    )}

                </div>

                {/* USER AVATAR */}
                <button
                    type="button"
                    className="avatar profile-avatar"
                    onClick={() => navigate("/profile")}
                    aria-label="Go to profile"
                    title={user?.name || "My Profile"}
                >
                    {getInitials(user?.name)}
                </button>

            </div>
        </header>
    );
}

export default Topbar;
