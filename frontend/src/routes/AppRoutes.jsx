
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Tasks from "../pages/Tasks.jsx";
import Calendar from "../pages/Calendar";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";

function AppRoutes() {
    return (
        <Routes>

            {/* Public routes */}
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Default route */}
            <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
            />

            {/* Unknown routes */}
            <Route
                path="*"
                element={<Navigate to="/dashboard" replace />}
            />

        </Routes>
    );
}

export default AppRoutes;
