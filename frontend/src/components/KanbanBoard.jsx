
import {
    DndContext,
    closestCorners
} from "@dnd-kit/core";

import KanbanColumn from "./KanbanColumn";

function KanbanBoard({
                         columns,
                         originalColumns,
                         onEdit,
                         onDelete,
                         onView,
                         onDragEnd
                     }) {

    // Get all tasks from the original, unfiltered columns
    const allTasks = (originalColumns ?? columns)
        .flatMap(column => column.tasks);

    // Sort tasks by database ID to maintain creation order
    const sortedTasks = [...allTasks].sort(
        (a, b) => Number(a.id) - Number(b.id)
    );

    // Assign dashboard numbers independently of database IDs
    const taskNumbers = new Map(
        sortedTasks.map((task, index) => [
            task.id,
            index + 1
        ])
    );

    return (
        <DndContext
            collisionDetection={closestCorners}
            onDragEnd={onDragEnd}
        >
            <section className="kanban-board">
                {columns.map((column) => {

                    const originalColumn = originalColumns?.find(
                        item => item.status === column.status
                    );

                    return (
                        <KanbanColumn
                            key={column.status}
                            column={column}
                            originalTaskCount={
                                originalColumn?.tasks.length ??
                                column.tasks.length
                            }
                            taskNumbers={taskNumbers}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onView={onView}
                        />
                    );
                })}
            </section>
        </DndContext>
    );
}

export default KanbanBoard;
