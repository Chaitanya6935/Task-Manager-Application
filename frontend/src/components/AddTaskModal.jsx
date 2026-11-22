
import { useState } from "react";

function AddTaskModal({ onClose, onAddTask }) {

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: "",
        startDate: new Date().toLocaleDateString("en-CA"),
        dueDate: "",
        priority: localStorage.getItem("defaultPriority") || "MEDIUM",
        notes: ""
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

        const taskData = {
            ...formData,
            title: formData.title.trim(),
            duration: formData.duration
                ? Number(formData.duration)
                : null
        };

        onAddTask(taskData);
    };

    return (
        <div className="modal-overlay">
            <div className="task-modal">
                <h2>Create New Task</h2>

                <form onSubmit={handleSubmit}>

                    <label>Task Title</label>
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter task title"
                        required
                    />

                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                    />

                    <label>Duration (minutes)</label>
                    <input
                        type="number"
                        name="duration"
                        min="1"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="Enter duration"
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
                        placeholder="Additional notes"
                    />

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type="submit">
                            Create Task
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default AddTaskModal;
