
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Phone, ShieldCheck, LogOut } from "lucide-react";
import "../App.css";

function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const initials = user?.name
        ? user.name
            .split(" ")
            .filter(Boolean)
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "U";

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="profile-page">
            <div className="profile-container">

                <div className="profile-header">
                    <h1>My Profile</h1>
                    <p>Manage your personal account information</p>
                </div>

                <div className="profile-card">

                    <div className="profile-cover"></div>

                    <div className="profile-main">
                        <div className="profile-avatar">
                            {initials}
                        </div>

                        <h2>{user?.name || "User"}</h2>
                        <p className="profile-email">
                            {user?.email || "No email available"}
                        </p>

                        <span className="profile-badge">
                            <ShieldCheck size={15} />
                            Registered User
                        </span>
                    </div>

                    <div className="profile-divider"></div>

                    <div className="profile-details">
                        <h3>Personal Information</h3>

                        <div className="profile-info-item">
                            <div className="profile-info-icon">
                                <User size={20} />
                            </div>
                            <div>
                                <span>Full Name</span>
                                <p>{user?.name || "Not available"}</p>
                            </div>
                        </div>

                        <div className="profile-info-item">
                            <div className="profile-info-icon">
                                <Mail size={20} />
                            </div>
                            <div>
                                <span>Email Address</span>
                                <p>{user?.email || "Not available"}</p>
                            </div>
                        </div>

                        <div className="profile-info-item">
                            <div className="profile-info-icon">
                                <Phone size={20} />
                            </div>
                            <div>
                                <span>Phone Number</span>
                                <p>{user?.phone || "Not available"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button
                            className="profile-logout-btn"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Profile;
