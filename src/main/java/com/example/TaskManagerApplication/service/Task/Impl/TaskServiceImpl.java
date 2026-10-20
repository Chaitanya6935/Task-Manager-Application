package com.example.TaskManagerApplication.service.Task.Impl;

import com.example.TaskManagerApplication.dto.taskDto.TaskRequestDto;
import com.example.TaskManagerApplication.dto.taskDto.TaskResponseDto;
import com.example.TaskManagerApplication.entity.Priority;
import com.example.TaskManagerApplication.entity.Task;
import com.example.TaskManagerApplication.entity.TaskStatus;
import com.example.TaskManagerApplication.entity.User;
import com.example.TaskManagerApplication.exception.ResourceNotFoundException;
import com.example.TaskManagerApplication.repository.TaskRepository;
import com.example.TaskManagerApplication.repository.UserRepository;
import com.example.TaskManagerApplication.service.Task.TaskService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
    public TaskResponseDto createTask(TaskRequestDto requestDto,Long userId) {

        // Step 1: Temporarily hardcode owner id = 1 (will be replaced by auth principal later)
//        Long ownerId = 3L;

//        User owner = userRepository.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User Not Found"));

        // Step 2: Load the owner — fail if it doesn't exist
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId));

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
    public TaskResponseDto getTaskById(Long id,Long userId) {
        Task task= taskRepository.findByIdAndUserId(id,userId).orElseThrow(() -> new ResourceNotFoundException(
                "Task not found with id: "+id));

        return mapToResponseDto(task);
    }

    @Override
    public Page<TaskResponseDto> getAllTask(TaskStatus status, Priority priority, Pageable pageable,Long userId) {

        Page<Task> tasks;

        if(status != null&& priority != null){
           tasks = taskRepository.findByStatusAndPriorityAndUserId(status,priority,pageable,userId);
        } else if (status !=null) {
             tasks = taskRepository.findByStatusAndUserId(status,pageable,userId);
        } else if (priority!=null) {
           tasks =taskRepository.findByPriorityAndUserId(priority,pageable,userId);

        } else {
            tasks = taskRepository.findByUserId(userId,pageable);
        }

        return tasks.map(this::mapToResponseDto);
    }

    @Override
    public TaskResponseDto updateTask(Long id, TaskRequestDto taskRequestDto,Long userId) {
        Task task = taskRepository.findByIdAndUserId(id,userId).orElseThrow(()-> new ResourceNotFoundException("Task not found with id :"+id));

        task.setPriority(taskRequestDto.getPriority());
        task.setNotes(taskRequestDto.getNotes());
        task.setDuration(taskRequestDto.getDuration());
        task.setDescription(taskRequestDto.getDescription());
        task.setTitle(taskRequestDto.getTitle());
        task.setDueDate(taskRequestDto.getDueDate());
        task.setStartDate(taskRequestDto.getStartDate());

        Task stask =taskRepository.save(task);
        return mapToResponseDto(stask);
    }

    @Override
    public void DeleteById(Long id,Long userId) {
        Task task = taskRepository.findByIdAndUserId(id,userId).orElseThrow(()-> new ResourceNotFoundException("Task not found "+id));
        taskRepository.delete(task);
    }

    @Override
    public List<TaskResponseDto> searchTaskByTitle(String title,Long userId) {
        return taskRepository.findByTitleAndUserIdContainingIgnoreCase(title,userId)
                        .stream()
                        .map(this::mapToResponseDto)
                        .toList();

    }
}