
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

function KanbanColumn({
                          column,
                          originalTaskCount,
                          taskNumbers,
                          onEdit,
                          onDelete,
                          onView
                      }) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.status
    });

    return (
        <div
            ref={setNodeRef}
            className="kanban-column"
            style={{
                border: isOver
                    ? "2px dashed var(--accent)"
                    : "1px solid var(--border)"
            }}
        >
            <div className="column-heading">
                <span
                    className="status-dot"
                    style={{ background: column.color }}
                />

                <h3>{column.title}</h3>

                <span className="task-count">
                    {column.tasks.length}
                </span>
            </div>

            {column.tasks.length > 0 ? (
                column.tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        taskNumber={taskNumbers?.get(task.id)}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onView={(task) =>
                            onView({ ...task, status: column.status })
                        }
                    />
                ))
            ) : (
                <div className="empty-state">
                    <p>
                        {originalTaskCount === 0
                            ? "No tasks yet"
                            : "No matching tasks"}
                    </p>
                </div>
            )}
        </div>
    );
}

export default KanbanColumn;
