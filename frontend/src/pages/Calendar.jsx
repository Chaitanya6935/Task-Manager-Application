
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import api from "../services/api";
import "../App.css";

function Calendar() {
    const [tasks, setTasks] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
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
                console.error("Calendar fetch failed:", err);
                setError("Unable to load calendar tasks.");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const previousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const getTasksForDate = (day) => {
        const date = [
            year,
            String(month + 1).padStart(2, "0"),
            String(day).padStart(2, "0")
        ].join("-");

        return tasks.filter(
            (task) => task.startDate <= date && task.dueDate >= date
        );
    };

    const today = new Date();
    const isToday = (day) =>
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year;

    return (
        <div className="calendar-page">
            <div className="calendar-header">
                <div>
                    <h1>Calendar</h1>
                    <p>View and manage your tasks by date.</p>
                </div>

                <CalendarDays size={28} />
            </div>

            <div className="calendar-container">
                <div className="calendar-navigation">
                    <button onClick={previousMonth}>
                        <ChevronLeft />
                    </button>

                    <h2>
                        {currentDate.toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric"
                        })}
                    </h2>

                    <button onClick={nextMonth}>
                        <ChevronRight />
                    </button>
                </div>

                {loading ? (
                    <p className="tasks-message">Loading calendar...</p>
                ) : error ? (
                    <p className="tasks-error">{error}</p>
                ) : (
                    <div className="calendar-grid">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                            (day) => (
                                <div className="calendar-weekday" key={day}>
                                    {day}
                                </div>
                            )
                        )}

                        {Array.from({ length: firstDay }).map((_, index) => (
                            <div
                                className="calendar-day empty"
                                key={`empty-${index}`}
                            />
                        ))}

                        {Array.from(
                            { length: daysInMonth },
                            (_, index) => index + 1
                        ).map((day) => {
                            const dayTasks = getTasksForDate(day);

                            return (
                                <div
                                    className={`calendar-day ${
                                        isToday(day) ? "today" : ""
                                    }`}
                                    key={day}
                                >
                                    <span className="calendar-date">
                                        {day}
                                    </span>

                                    <div className="calendar-day-tasks">
                                        {dayTasks.map((task) => (
                                            <div
                                                className={`calendar-task status-${task.status?.toLowerCase()}`}
                                                key={task.id}
                                                title={task.title}
                                            >
                                                {task.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Calendar;
