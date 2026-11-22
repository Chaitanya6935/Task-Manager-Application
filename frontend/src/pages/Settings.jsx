
import { useEffect,useState } from "react";
import {
    Palette,
    Bell,
    User,
    ShieldCheck,
    ListTodo,
    Save
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "../App.css";

function Settings() {
    const { user } = useAuth();

    const [settings, setSettings] = useState({
        theme: localStorage.getItem("theme") || "dark",
        defaultPriority: localStorage.getItem("defaultPriority") || "MEDIUM",
        emailNotifications:
            localStorage.getItem("emailNotifications") !== "false",
        taskReminders:
            localStorage.getItem("taskReminders") !== "false"
    });

    const handleChange = (key, value) => {
        setSettings((previous) => ({
            ...previous,
            [key]: value
        }));
    };

    const handleSave = () => {
        localStorage.setItem("theme", settings.theme);
        localStorage.setItem("defaultPriority", settings.defaultPriority);
        localStorage.setItem(
            "emailNotifications",
            settings.emailNotifications
        );
        localStorage.setItem("taskReminders", settings.taskReminders);

        alert("Settings saved successfully!");
    };
    useEffect(() => {
        document.body.classList.toggle(
            "light-theme",
            settings.theme === "light"
        );
    }, [settings.theme]);

    return (
        <div className="settings-page">
            <div className="settings-header">
                <div>
                    <h1>Settings</h1>
                    <p>Manage your application preferences.</p>
                </div>
            </div>

            <div className="settings-container">

                <section className="settings-card">
                    <div className="settings-section-title">
                        <Palette />
                        <div>
                            <h3>Appearance</h3>
                            <p>Customize your application appearance.</p>
                        </div>
                    </div>

                    <div className="settings-option">
                        <div>
                            <strong>Theme</strong>
                            <p>Choose your preferred theme.</p>
                        </div>

                        <select
                            value={settings.theme}
                            onChange={(e) =>
                                handleChange("theme", e.target.value)
                            }
                        >
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                        </select>
                    </div>
                </section>

                <section className="settings-card">
                    <div className="settings-section-title">
                        <ListTodo />
                        <div>
                            <h3>Task Preferences</h3>
                            <p>Configure your default task settings.</p>
                        </div>
                    </div>

                    <div className="settings-option">
                        <div>
                            <strong>Default Priority</strong>
                            <p>Priority automatically selected for new tasks.</p>
                        </div>

                        <select
                            value={settings.defaultPriority}
                            onChange={(e) =>
                                handleChange("defaultPriority", e.target.value)
                            }
                        >
                            <option value="VERY_IMPORTANT">Very Important</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                            <option value="VERY_LOW">Very Low</option>
                        </select>
                    </div>
                </section>

                <section className="settings-card">
                    <div className="settings-section-title">
                        <Bell />
                        <div>
                            <h3>Notifications</h3>
                            <p>Manage your notification preferences.</p>
                        </div>
                    </div>

                    <div className="settings-option">
                        <div>
                            <strong>Email Notifications</strong>
                            <p>Receive notifications through email.</p>
                        </div>

                        <input
                            type="checkbox"
                            checked={settings.emailNotifications}
                            onChange={(e) =>
                                handleChange(
                                    "emailNotifications",
                                    e.target.checked
                                )
                            }
                        />
                    </div>

                    <div className="settings-option">
                        <div>
                            <strong>Task Reminders</strong>
                            <p>Enable reminders for upcoming tasks.</p>
                        </div>

                        <input
                            type="checkbox"
                            checked={settings.taskReminders}
                            onChange={(e) =>
                                handleChange("taskReminders", e.target.checked)
                            }
                        />
                    </div>
                </section>

                <section className="settings-card">
                    <div className="settings-section-title">
                        <User />
                        <div>
                            <h3>Account Information</h3>
                            <p>Your registered account details.</p>
                        </div>
                    </div>

                    <div className="settings-account">
                        <p><strong>Name:</strong> {user?.name || "Not available"}</p>
                        <p><strong>Email:</strong> {user?.email || "Not available"}</p>
                        <p><strong>Phone:</strong> {user?.phone || "Not available"}</p>
                    </div>
                </section>

                <section className="settings-card">
                    <div className="settings-section-title">
                        <ShieldCheck />
                        <div>
                            <h3>Security</h3>
                            <p>Your account is protected by authentication.</p>
                        </div>
                    </div>

                    <p className="settings-security-text">
                        You are signed in to your Task Manager account.
                    </p>
                </section>

                <button
                    className="settings-save-btn"
                    onClick={handleSave}
                >
                    <Save size={17} />
                    Save Settings
                </button>

            </div>
        </div>
    );
}

export default Settings;
