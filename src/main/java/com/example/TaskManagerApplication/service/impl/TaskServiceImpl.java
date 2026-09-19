package com.example.TaskManagerApplication.service.impl;

import com.example.TaskManagerApplication.dto.TaskRequestDto;
import com.example.TaskManagerApplication.dto.TaskResponseDto;
import com.example.TaskManagerApplication.entity.Task;
import com.example.TaskManagerApplication.entity.TaskStatus;
import com.example.TaskManagerApplication.entity.User;
import com.example.TaskManagerApplication.exception.ResourceNotFoundException;
import com.example.TaskManagerApplication.repository.TaskRepository;
import com.example.TaskManagerApplication.repository.UserRepository;
import com.example.TaskManagerApplication.service.TaskService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


//import java.awt.*;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskServiceImpl(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Override
    public TaskResponseDto createTask(TaskRequestDto requestDto) {

        // Step 1: Temporarily hardcode owner id = 1 (will be replaced by auth principal later)
        Long ownerId = 3L;

        // Step 2: Load the owner — fail if it doesn't exist
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + ownerId));

        // Step 3: Map request DTO → Task entity
        Task task = new Task();
        task.setTitle(requestDto.getTitle());
        task.setDescription(requestDto.getDescription());
        task.setDuration(requestDto.getDuration());
        task.setStartDate(requestDto.getStartDate());
        task.setDueDate(requestDto.getDueDate());
        task.setPriority(requestDto.getPriority());
        task.setNotes(requestDto.getNotes());

        // Step 4: Set fields that the client must NOT control
        task.setStatus(TaskStatus.TODO);   // new tasks always start TODO
        task.setUser(owner);               // owner relationship

        // Step 5: Persist
        Task savedTask = taskRepository.save(task);

        // Step 6: Map saved entity → response DTO
        return mapToResponseDto(savedTask);
    }



    private TaskResponseDto mapToResponseDto(Task task) {
        TaskResponseDto dto = new TaskResponseDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setDuration(task.getDuration());
        dto.setStartDate(task.getStartDate());
        dto.setDueDate(task.getDueDate());
        dto.setPriority(task.getPriority());
        dto.setStatus(task.getStatus());
        dto.setNotes(task.getNotes());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        dto.setCompletedAt(task.getCompletedAt());
        dto.setUserId(task.getUser().getId());
        return dto;
    }
    @Override
    public TaskResponseDto getTaskById(Long id) {
        Task task= taskRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(
                "Task not found with id: "+id));

        return mapToResponseDto(task);
    }

    @Override
    public List<TaskResponseDto> getAllTask() {
        List<Task> tasks = taskRepository.findAll();
        List<TaskResponseDto> responseDtos = new ArrayList<>();
        for(Task task:tasks){
             responseDtos.add(mapToResponseDto(task));
        }
        return responseDtos;
    }
}