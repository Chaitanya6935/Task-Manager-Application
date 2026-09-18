package com.example.TaskManagerApplication.dto;

import com.example.TaskManagerApplication.entity.Priority;
import com.example.TaskManagerApplication.entity.TaskStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class TaskResponseDto {

    private Long id;
    private String title;
    private String description;
    private Integer duration;
    private LocalDate startDate;
    private LocalDate dueDate;
    private Priority priority;
    private TaskStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
    private Long userId;
}