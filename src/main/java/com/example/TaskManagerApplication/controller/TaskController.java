package com.example.TaskManagerApplication.controller;

import com.example.TaskManagerApplication.dto.TaskRequestDto;
import com.example.TaskManagerApplication.dto.TaskResponseDto;
import com.example.TaskManagerApplication.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<TaskResponseDto> createTask(@RequestBody TaskRequestDto requestDto) {
        TaskResponseDto response = taskService.createTask(requestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDto> getById(@PathVariable Long id){
        TaskResponseDto dto = taskService.getTaskById(id);
        return new  ResponseEntity<>(dto,HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<List<TaskResponseDto>> getAll(){
        List<TaskResponseDto> dtos = taskService.getAllTask();
        return new ResponseEntity<>(dtos,HttpStatus.OK);

    }
}