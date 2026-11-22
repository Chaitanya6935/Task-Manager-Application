package com.example.TaskManagerApplication.controller;

import com.example.TaskManagerApplication.dto.taskDto.TaskRequestDto;
import com.example.TaskManagerApplication.dto.taskDto.TaskResponseDto;
import com.example.TaskManagerApplication.dto.taskDto.TaskStatusUpdateDto;
import com.example.TaskManagerApplication.entity.Priority;
import com.example.TaskManagerApplication.entity.TaskStatus;
import com.example.TaskManagerApplication.security.CustomUserDetails;
import com.example.TaskManagerApplication.service.Task.TaskService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.AuthenticatedPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskResponseDto> createTask( @Valid @RequestBody TaskRequestDto requestDto, @AuthenticationPrincipal CustomUserDetails userDetails) {
        TaskResponseDto response = taskService.createTask(requestDto,userDetails.getUserId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDto> getById(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails){
        TaskResponseDto dto = taskService.getTaskById(id,userDetails.getUserId());
        return new  ResponseEntity<>(dto,HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<Page<TaskResponseDto>> getAll(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "asc") String direction,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){

        if (page < 0 || size < 1 || size > 100) {
            throw new IllegalArgumentException("Invalid pagination parameters");
        }

        List<String> allowedSortFields = List.of(
                "id", "title", "startDate", "dueDate",
                "priority", "status", "createdAt"
        );

        if (!allowedSortFields.contains(sort)) {
            throw new IllegalArgumentException("Invalid sort field");
        }
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortDirection,sort)
        );
        Page<TaskResponseDto> dtos = taskService.getAllTask(status,priority,pageable,userDetails.getUserId());
//        return new ResponseEntity<>(dtos,HttpStatus.OK);
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TaskResponseDto>> search(
            @RequestParam("title") String title,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        List<TaskResponseDto> dtos =
                taskService.searchTaskByTitle(title, userDetails.getUserId());

        return ResponseEntity.ok(dtos);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<TaskResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequestDto taskRequestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        TaskResponseDto dto = taskService.updateTask(
                id,
                taskRequestDto,
                userDetails.getUserId()
        );

        return ResponseEntity.ok(dto);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void>  delete(@PathVariable Long id,@AuthenticationPrincipal CustomUserDetails userDetails){
         taskService.DeleteById(id,userDetails.getUserId());
         return ResponseEntity.noContent().build();
    }


    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponseDto> updateTaskStatus(
            @PathVariable Long id,
            @Valid @RequestBody TaskStatusUpdateDto requestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        TaskResponseDto response = taskService.updateTaskStatus(
                id,
                requestDto.getStatus(),
                userDetails.getUserId()
        );

        return ResponseEntity.ok(response);
    }


}