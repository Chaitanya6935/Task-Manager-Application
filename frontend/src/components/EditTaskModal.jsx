
import { useState } from "react";

function EditTaskModal({ task, onClose, onUpdateTask }) {
    const [formData, setFormData] = useState({
        title: task.title || "",
        description: task.description || "",
        duration: task.duration ?? "",
        startDate: task.startDate || "",
        dueDate: task.dueDate || "",
        priority: task.priority || "MEDIUM",
        notes: task.notes || ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title.trim()) return;

        if (!formData.startDate || !formData.dueDate) {
            alert("Please select start date and due date.");
            return;
        }

        onUpdateTask({
            ...formData,
            title: formData.title.trim(),
            duration: formData.duration
                ? Number(formData.duration)
                : null
        });
    };

    return (
        <div className="modal-overlay">
            <div className="task-modal">
                <h2>Edit Task</h2>

                <form onSubmit={handleSubmit}>
                    <label>Task Title</label>
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <label>Duration (minutes)</label>
                    <input
                        type="number"
                        name="duration"
                        min="1"
                        value={formData.duration}
                        onChange={handleChange}
                    />

                    <label>Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />

                    <label>Due Date</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        min={formData.startDate}
                        required
                    />

                    <label>Priority</label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        <option value="VERY_LOW">Very Low</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="VERY_IMPORTANT">Very Important</option>
                    </select>

                    <label>Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                    />

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>

                        <button type="submit">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditTaskModal;
