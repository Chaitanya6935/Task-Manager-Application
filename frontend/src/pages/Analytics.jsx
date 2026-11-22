
import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from "recharts";

import { CheckCircle, Clock, ListTodo, TrendingUp } from "lucide-react";
import api from "../services/api";
import "../App.css";

const COLORS = ["#64748b", "#3b82f6", "#22c55e"];
const PRIORITY_COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#8b5cf6", "#64748b"];

function Analytics() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await api.get("/api/tasks/all", {
                    params: {
                        page: 0,
                        size: 100,
                        sort: "id",
                        direction: "asc"
                    }
                });

                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.content || [];

                setTasks(data);
            } catch (err) {
                console.error("Analytics fetch failed:", err);
                setError("Unable to load analytics.");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "COMPLETED").length;
    const inProgress = tasks.filter(t => t.status === "IN_PROGRESS").length;
    const todo = tasks.filter(t => t.status === "TODO").length;

    const completionRate = total
        ? Math.round((completed / total) * 100)
        : 0;

    const statusData = [
        { name: "To Do", value: todo },
        { name: "In Progress", value: inProgress },
        { name: "Completed", value: completed }
    ];

    const priorityData = [
        { name: "High", value: tasks.filter(t => t.priority === "HIGH").length },
        { name: "Medium", value: tasks.filter(t => t.priority === "MEDIUM").length },
        { name: "Low", value: tasks.filter(t => t.priority === "LOW").length },
        { name: "Very Important", value: tasks.filter(t => t.priority === "VERY_IMPORTANT").length },
        { name: "Very Low", value: tasks.filter(t => t.priority === "VERY_LOW").length }
    ];

    const chartTooltipStyle = {
        backgroundColor: "#1e293b",
        border: "1px solid #334155",
        borderRadius: "8px",
        color: "#f8fafc"
    };

    if (loading) {
        return <div className="analytics-page">Loading analytics...</div>;
    }

    if (error) {
        return <div className="analytics-page analytics-error">{error}</div>;
    }

    return (
        <div className="analytics-page">
            <div className="analytics-header">
                <div>
                    <h1>Analytics</h1>
                    <p>Track your productivity and task performance.</p>
                </div>
                <TrendingUp size={28} />
            </div>

            <div className="analytics-stats">
                <div className="analytics-stat-card">
                    <ListTodo />
                    <span>Total Tasks</span>
                    <h2>{total}</h2>
                </div>

                <div className="analytics-stat-card">
                    <CheckCircle />
                    <span>Completed</span>
                    <h2>{completed}</h2>
                </div>

                <div className="analytics-stat-card">
                    <Clock />
                    <span>In Progress</span>
                    <h2>{inProgress}</h2>
                </div>

                <div className="analytics-stat-card">
                    <TrendingUp />
                    <span>Completion Rate</span>
                    <h2>{completionRate}%</h2>
                </div>
            </div>

            <div className="analytics-charts">
                <div className="analytics-chart-card">
                    <h3>Task Status Distribution</h3>

                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                label
                            >
                                {statusData.map((entry, index) => (
                                    <Cell
                                        key={entry.name}
                                        fill={COLORS[index]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={chartTooltipStyle} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="analytics-chart-card">
                    <h3>Priority Distribution</h3>

                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={priorityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis
                                dataKey="name"
                                stroke="#94a3b8"
                                tick={{ fontSize: 11 }}
                                interval={0}
                                angle={-15}
                                textAnchor="end"
                                height={55}
                            />
                            <YAxis stroke="#94a3b8" allowDecimals={false} />
                            <Tooltip contentStyle={chartTooltipStyle} />
                            <Bar dataKey="value" name="Tasks" radius={[5, 5, 0, 0]}>
                                {priorityData.map((entry, index) => (
                                    <Cell
                                        key={entry.name}
                                        fill={PRIORITY_COLORS[index]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="analytics-progress-card">
                <h3>Overall Completion Progress</h3>

                <div className="analytics-progress-track">
                    <div
                        className="analytics-progress-fill"
                        style={{ width: `${completionRate}%` }}
                    />
                </div>

                <p>{completed} of {total} tasks completed ({completionRate}%)</p>
            </div>
        </div>
    );
}

export default Analytics;
