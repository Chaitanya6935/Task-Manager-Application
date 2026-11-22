
import { CalendarDays, Pencil, Trash2, GripVertical,Eye } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function formatTaskDate(value) {
    if (!value) return "No due date";

    const match = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

    if (match) {
        const [, year, month, day] = match;

        const date = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        );

        // Reject invalid dates such as 2027-13-40
        if (
            date.getFullYear() !== Number(year) ||
            date.getMonth() !== Number(month) - 1 ||
            date.getDate() !== Number(day)
        ) {
            return "Invalid date";
        }

        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(date);
    }

    return value;
}

function TaskCard({ task,taskNumber,onEdit, onDelete,onView }) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging
    } = useDraggable({
        id: task.id
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.4 : 1,
        cursor: "default"
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="task-card"
        >
            <div className="task-card-header">

                <h4>{task.title}</h4>
                <span className="task-number">
    Task {taskNumber}
</span>

                <div className="task-actions">

                    <button
                        type="button"
                        {...attributes}
                        {...listeners}
                        title="Drag task"
                        className="drag-handle"
                    >
                        <GripVertical size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => onView(task)}
                        title="View task"
                    >
                        <Eye size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={() => onEdit(task)}
                        title="Edit task"
                    >
                        <Pencil size={15} />
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(task.id)}
                        title="Delete task"
                    >
                        <Trash2 size={15} />
                    </button>


                </div>
            </div>

            {task.description && <p>{task.description}</p>}

            <span className={`priority ${task.priority.toLowerCase()}`}>
        {task.priority}
      </span>

            <div className="task-date">
                <CalendarDays size={14} />
                {formatTaskDate(task.dueDate || task.date)}
            </div>

        </div>
    );
}

export default TaskCard;
