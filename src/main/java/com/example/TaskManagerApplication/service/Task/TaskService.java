package com.example.TaskManagerApplication.service.Task;

import com.example.TaskManagerApplication.dto.taskDto.TaskRequestDto;
import com.example.TaskManagerApplication.dto.taskDto.TaskResponseDto;
import com.example.TaskManagerApplication.entity.Priority;
import com.example.TaskManagerApplication.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

//import java.awt.*;

public interface TaskService {

    TaskResponseDto createTask(TaskRequestDto requestDto ,Long userId);
    TaskResponseDto getTaskById(Long id,Long userId);
    Page<TaskResponseDto> getAllTask(TaskStatus status, Priority priority, Pageable pageable,Long userId);
    TaskResponseDto updateTask(Long id,TaskRequestDto taskRequestDto,Long userId);
    void DeleteById(Long id,Long userId);
    List<TaskResponseDto> searchTaskByTitle(String title,Long userId);
}