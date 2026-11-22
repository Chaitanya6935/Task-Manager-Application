
package com.example.TaskManagerApplication.dto.taskDto;

import com.example.TaskManagerApplication.entity.TaskStatus;
import jakarta.validation.constraints.NotNull;

public class TaskStatusUpdateDto {

    @NotNull(message = "Status is required")
    private TaskStatus status;

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }
}
