package com.example.TaskManagerApplication.dto.taskDto;

import com.example.TaskManagerApplication.entity.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TaskRequestDto {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    @Size(max = 1000, message = "Description too long")
    private String description;
    @jakarta.validation.constraints.Positive(message = "Duration must be positive")
    private Integer duration;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @Size(max = 1000, message = "Notes too long")
    private String notes;
}