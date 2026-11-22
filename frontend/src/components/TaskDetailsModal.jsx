
import { X, CalendarDays, Flag, CircleCheck } from "lucide-react";

function TaskDetailsModal({ task, onClose }) {
    if (!task) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="task-modal details-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="details-header">
                    <h2>Task Details</h2>

                    <button type="button" onClick={onClose}>
                        <X />
                    </button>
                </div>

                <h3>{task.title}</h3>

                <p className="details-description">
                    {task.description || "No description provided."}
                </p>

                <div className="details-info">
                    <div>
                        <Flag size={18} />
                        <span>Priority</span>
                        <strong>{task.priority}</strong>
                    </div>

                    <div>
                        <CircleCheck size={18} />
                        <span>Status</span>
                        <strong>{task.status}</strong>
                    </div>

                    <div>
                        <CalendarDays size={18} />
                        <span>Due Date</span>
                        <strong>{task.dueDate || task.date || "Not set"}</strong>
                    </div>

                    <div>
                        <span>Task ID</span>
                        <strong>{task.id}</strong>
                    </div>
                </div>

                <button
                    className="add-button details-close"
                    type="button"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default TaskDetailsModal;
