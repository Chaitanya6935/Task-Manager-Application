
import { useEffect, useState } from "react";
import { Search, CalendarDays, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css";
import EditTaskModal from "../components/EditTaskModal";


function Tasks() {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);

                const response = await api.get("/api/tasks/all", {
                    params: {
                        page: 0,
                        size: 100,
                        sort: "id",
                        direction: "desc"
                    }
                });

                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.content || [];

                setTasks(data);
            } catch (err) {
                console.error("Fetch tasks failed:", err);
                setError("Unable to load tasks. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "ALL" || task.status === statusFilter;

        const matchesPriority =
            priorityFilter === "ALL" || task.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const getPriorityClass = (priority) => {
        return `task-priority priority-${priority?.toLowerCase()}`;
    };

    const getStatusClass = (status) => {
        return `task-status status-${status?.toLowerCase()}`;
    };

    const handleUpdateTask = async (updatedData) => {
        try {
            await api.put(`/api/tasks/update/${editingTask.id}`, updatedData);

            setTasks((previousTasks) =>
                previousTasks.map((task) =>
                    task.id === editingTask.id
                        ? { ...task, ...updatedData }
                        : task
                )
            );

            setEditingTask(null);
            alert("Task updated successfully!");
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Failed to update task.");
        }


    };

    const handleDeleteTask = async (taskId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/api/tasks/delete/${taskId}`);

            setTasks((previousTasks) =>
                previousTasks.filter((task) => task.id !== taskId)
            );

            alert("Task deleted successfully!");
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task.");
        }
    };

    return (
        <div className="tasks-page">
            <div className="tasks-page-header">
                <div>
                    <h1>My Tasks</h1>
                    <p>Manage and track all your tasks in one place.</p>
                </div>

                <button
                    className="tasks-add-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    + Dashboard
                </button>
            </div>

            <div className="tasks-summary">
                <div className="tasks-summary-card">
                    <span>Total Tasks</span>
                    <h2>{tasks.length}</h2>
                </div>

                <div className="tasks-summary-card">
                    <span>To Do</span>
                    <h2>{tasks.filter(t => t.status === "TODO").length}</h2>
                </div>

                <div className="tasks-summary-card">
                    <span>In Progress</span>
                    <h2>{tasks.filter(t => t.status === "IN_PROGRESS").length}</h2>
                </div>

                <div className="tasks-summary-card">
                    <span>Completed</span>
                    <h2>{tasks.filter(t => t.status === "COMPLETED").length}</h2>
                </div>
            </div>

            <div className="tasks-filters">
                <div className="tasks-search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="ALL">All Status</option>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                </select>

                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                >
                    <option value="ALL">All Priorities</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                    <option value="VERY_IMPORTANT">Very Important</option>
                    <option value="VERY_LOW">Very Low</option>
                </select>
            </div>

            {loading ? (
                <p className="tasks-message">Loading tasks...</p>
            ) : error ? (
                <p className="tasks-error">{error}</p>
            ) : filteredTasks.length === 0 ? (
                <div className="tasks-empty">
                    <h3>No tasks found</h3>
                    <p>Try changing your search or filters.</p>
                </div>
            ) : (
                <div className="tasks-list">
                    {filteredTasks.map((task) => (
                        <div className="tasks-list-card" key={task.id}>
                            <div className="tasks-list-main">
                                <h3>{task.title}</h3>


                                <div className="task-actions">
                                    <button
                                        className="task-edit-btn"
                                        onClick={() => setEditingTask(task)}
                                    >
                                        Edit Task
                                    </button>
                                    <button
                                        className="task-delete-btn"
                                        onClick={() => handleDeleteTask(task.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                                <p>{task.description || "No description provided."}</p>



                                <div className="tasks-meta">
                                    <span>
                                        <CalendarDays size={15} />
                                        {task.dueDate || "No due date"}
                                    </span>

                                    <span>
                                        <Clock size={15} />
                                        {task.duration ?? 0} minutes
                                    </span>
                                </div>
                            </div>

                            <div className="tasks-list-badges">
                                <span className={getPriorityClass(task.priority)}>
                                    {task.priority?.replaceAll("_", " ")}
                                </span>

                                <span className={getStatusClass(task.status)}>
                                    {task.status?.replaceAll("_", " ")}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    onUpdateTask={handleUpdateTask}
                />
            )}

        </div>

    );
}

export default Tasks;
