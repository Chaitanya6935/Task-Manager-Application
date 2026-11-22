
import { Plus } from "lucide-react";
import "../App.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import KanbanBoard from "../components/KanbanBoard.jsx";
import { useState, useEffect } from "react";
import api from "../services/api";
import AddTaskModal from "../components/AddTaskModal.jsx";
import EditTaskModal from "../components/EditTaskModal";
import TaskDetailsModal from "../components/TaskDetailsModal";

import {
    generateNotifications,
    getSavedNotifications
} from "../utils/notificationUtils";

const columns = [
    {
        title: "To Do",
        status: "TODO",
        color: "#64748b",
        tasks: []
    },
    {
        title: "In Progress",
        status: "IN_PROGRESS",
        color: "#3b82f6",
        tasks: []
    },
    {
        title: "Completed",
        status: "COMPLETED",
        color: "#22c55e",
        tasks: []
    }
];

function Dashboard() {
    const [taskColumns, setTaskColumns] = useState(columns);

    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [selectedTask, setSelectedTask] = useState(null);

    const [notifications, setNotifications] = useState([]);
    const [notificationsLoaded, setNotificationsLoaded] = useState(false);

    // =====================================
    // NOTIFICATION REFRESH HELPER
    // =====================================

    const refreshNotifications = (tasks) => {
        const generated = generateNotifications(tasks);

        setNotifications((previous) => {
            let saved = [];

            try {
                const stored = JSON.parse(
                    localStorage.getItem("notifications") || "[]"
                );

                saved = Array.isArray(stored) ? stored : [];
            } catch (error) {
                console.error("Failed to read saved notifications:", error);
            }

            return generated.map((notification) => {
                const current = previous.find(
                    (item) => item.id === notification.id
                );

                const stored = saved.find(
                    (item) => item.id === notification.id
                );

                return {
                    ...notification,
                    read: current?.read ?? stored?.read ?? false
                };
            });
        });
    };

    // =====================================
    // CLEAR FILTERS
    // =====================================

    const clearFilters = () => {
        setSearchTerm("");
        setPriorityFilter("ALL");
        setStatusFilter("ALL");
    };

    // =====================================
    // DASHBOARD STATISTICS
    // =====================================

    const totalTasks = taskColumns.reduce(
        (total, column) => total + column.tasks.length,
        0
    );

    const todoTasks = taskColumns.find(
        (column) => column.status === "TODO"
    )?.tasks.length ?? 0;

    const inProgressTasks = taskColumns.find(
        (column) => column.status === "IN_PROGRESS"
    )?.tasks.length ?? 0;

    const completedTasks = taskColumns.find(
        (column) => column.status === "COMPLETED"
    )?.tasks.length ?? 0;

    // =====================================
    // FILTER TASKS
    // =====================================

    const filteredColumns = taskColumns.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => {
            const searchMatch =
                `${task.title} ${task.description || ""}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const priorityMatch =
                priorityFilter === "ALL" ||
                task.priority === priorityFilter;

            const statusMatch =
                statusFilter === "ALL" ||
                column.status === statusFilter;

            return searchMatch && priorityMatch && statusMatch;
        })
    }));

    // =====================================
    // DRAG AND DROP
    // =====================================

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) return;

        const taskId = active.id;
        const newStatus = over.id;

        const previousColumns = taskColumns;

        const sourceColumn = previousColumns.find((column) =>
            column.tasks.some(
                (task) => String(task.id) === String(taskId)
            )
        );

        const movedTask = sourceColumn?.tasks.find(
            (task) => String(task.id) === String(taskId)
        );

        const targetColumn = previousColumns.find(
            (column) => column.status === newStatus
        );

        if (!movedTask || !targetColumn) return;

        if (movedTask.status === newStatus) return;

        const updatedTask = {
            ...movedTask,
            status: newStatus
        };

        const updatedColumns = previousColumns.map((column) => ({
            ...column,
            tasks: column.tasks
                .filter(
                    (task) => String(task.id) !== String(taskId)
                )
                .concat(
                    column.status === newStatus
                        ? [updatedTask]
                        : []
                )
        }));

        setTaskColumns(updatedColumns);

        try {
            await api.patch(`/api/tasks/${taskId}/status`, {
                status: newStatus
            });

            refreshNotifications(
                updatedColumns.flatMap((column) => column.tasks)
            );

        } catch (error) {
            console.error("Status update failed:", error);

            setTaskColumns(previousColumns);

            alert(
                error.response?.data?.message ||
                "Unable to update task status. Please try again."
            );
        }
    };

    // =====================================
    // DELETE TASK
    // =====================================

    const handleDeleteTask = async (taskId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/api/tasks/delete/${taskId}`);

            const remainingTasks = taskColumns
                .flatMap((column) => column.tasks)
                .filter(
                    (task) => String(task.id) !== String(taskId)
                );

            setTaskColumns((previousColumns) =>
                previousColumns.map((column) => ({
                    ...column,
                    tasks: column.tasks.filter(
                        (task) => String(task.id) !== String(taskId)
                    )
                }))
            );

            refreshNotifications(remainingTasks);

            if (String(selectedTask?.id) === String(taskId)) {
                setSelectedTask(null);
            }

        } catch (error) {
            console.error("Delete task failed:", error);

            alert(
                error.response?.data?.message ||
                "Unable to delete task. Please try again."
            );
        }
    };

    // =====================================
    // EDIT TASK
    // =====================================

    const handleEditTask = (task) => {
        setEditingTask(task);
    };

    // =====================================
    // UPDATE TASK
    // =====================================

    const handleUpdateTask = async (formData) => {
        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                duration: formData.duration,
                startDate: formData.startDate,
                dueDate: formData.dueDate,
                priority: formData.priority,
                notes: formData.notes
            };

            const response = await api.put(
                `/api/tasks/update/${editingTask.id}`,
                payload
            );

            const savedTask = {
                ...editingTask,
                ...response.data,
                ...payload,
                status: response.data.status ?? editingTask.status,
                date: payload.dueDate
            };

            const updatedTasks = taskColumns
                .flatMap((column) => column.tasks)
                .map((task) =>
                    String(task.id) === String(savedTask.id)
                        ? savedTask
                        : task
                );

            setTaskColumns((previousColumns) =>
                previousColumns.map((column) => ({
                    ...column,
                    tasks: column.tasks.map((task) =>
                        String(task.id) === String(savedTask.id)
                            ? savedTask
                            : task
                    )
                }))
            );

            refreshNotifications(updatedTasks);

            setEditingTask(null);

        } catch (error) {
            console.error("Update task failed:", error);

            alert(
                error.response?.data?.message ||
                "Unable to update task. Please try again."
            );
        }
    };

    // =====================================
    // ADD TASK
    // =====================================

    const handleAddTask = async (newTask) => {
        try {
            const response = await api.post(
                "/api/tasks",
                newTask
            );

            const createdTask = {
                ...response.data,
                date: response.data.dueDate
            };

            const updatedTasks = [
                ...taskColumns.flatMap((column) => column.tasks),
                createdTask
            ];

            setTaskColumns((previousColumns) =>
                previousColumns.map((column) => ({
                    ...column,
                    tasks:
                        column.status === createdTask.status
                            ? [...column.tasks, createdTask]
                            : column.tasks
                }))
            );

            refreshNotifications(updatedTasks);

            setShowModal(false);

        } catch (error) {
            console.error("Create task failed:", error);

            alert(
                error.response?.data?.message ||
                "Unable to create task. Please try again."
            );
        }
    };

    // =====================================
    // FETCH TASKS
    // =====================================

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

                const tasks = Array.isArray(response.data)
                    ? response.data
                    : response.data.content;

                const generatedNotifications =
                    generateNotifications(tasks);

                const savedNotifications =
                    getSavedNotifications(generatedNotifications);

                setNotifications(savedNotifications);
                setNotificationsLoaded(true);

                localStorage.setItem(
                    "notifications",
                    JSON.stringify(savedNotifications)
                );

                setTaskColumns((previousColumns) =>
                    previousColumns.map((column) => ({
                        ...column,
                        tasks: tasks
                            .filter(
                                (task) => task.status === column.status
                            )
                            .map((task) => ({
                                ...task,
                                date: task.dueDate
                            }))
                    }))
                );

            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    // =====================================
    // SAVE NOTIFICATIONS
    // =====================================

    useEffect(() => {
        if (!notificationsLoaded) return;

        localStorage.setItem(
            "notifications",
            JSON.stringify(notifications)
        );
    }, [notifications, notificationsLoaded]);

    // =====================================
    // MARK ONE NOTIFICATION AS READ
    // =====================================

    const handleMarkAsRead = (notificationId) => {
        setNotifications((previous) =>
            previous.map((notification) =>
                notification.id === notificationId
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    // =====================================
    // MARK ALL NOTIFICATIONS AS READ
    // =====================================

    const handleMarkAllAsRead = () => {
        setNotifications((previous) =>
            previous.map((notification) => ({
                ...notification,
                read: true
            }))
        );
    };

    // =====================================
    // DASHBOARD UI
    // =====================================

    return (
        <div className="app-layout">

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="main-content">

                <Topbar
                    onMenuClick={() => setSidebarOpen(true)}
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAllAsRead={handleMarkAllAsRead}

                />

                <section className="dashboard-heading">

                    <div>
                        <h1>My Tasks</h1>
                        <p>Track your work and stay productive.</p>
                    </div>

                    <div className="dashboard-actions">

                        <input
                            type="text"
                            className="task-search"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <select
                            className="task-filter"
                            value={priorityFilter}
                            onChange={(e) =>
                                setPriorityFilter(e.target.value)
                            }
                        >
                            <option value="ALL">All Priorities</option>
                            <option value="VERY_IMPORTANT">
                                Very Important
                            </option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                            <option value="VERY_LOW">Very Low</option>
                        </select>

                        <select
                            className="task-filter"
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>

                        {(searchTerm !== "" ||
                            priorityFilter !== "ALL" ||
                            statusFilter !== "ALL") && (
                            <button
                                className="clear-filters-btn"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>
                        )}

                        <button
                            className="add-button"
                            onClick={() => setShowModal(true)}
                        >
                            <Plus size={18} />
                            Add Task
                        </button>

                    </div>
                </section>

                <section className="stats-grid">
                    <Stat title="Total Tasks" value={totalTasks} />
                    <Stat title="To Do" value={todoTasks} />
                    <Stat title="In Progress" value={inProgressTasks} />
                    <Stat title="Completed" value={completedTasks} />
                </section>

                <KanbanBoard
                    originalColumns={taskColumns}
                    columns={filteredColumns}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onDragEnd={handleDragEnd}
                    onView={(task) => setSelectedTask(task)}
                />

            </main>

            {showModal && (
                <AddTaskModal
                    onClose={() => setShowModal(false)}
                    onAddTask={handleAddTask}
                />
            )}

            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    onUpdateTask={handleUpdateTask}
                />
            )}

            {selectedTask && (
                <TaskDetailsModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}

        </div>
    );
}

function Stat({ title, value }) {
    return (
        <div className="stat-card">
            <p>{title}</p>
            <h2>{value}</h2>
        </div>
    );
}

export default Dashboard;
