package com.example.TaskManagerApplication.service;

import com.example.TaskManagerApplication.dto.TaskRequestDto;
import com.example.TaskManagerApplication.dto.TaskResponseDto;
import com.example.TaskManagerApplication.entity.Task;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;

//import java.awt.*;

public interface TaskService {

    TaskResponseDto createTask(TaskRequestDto requestDto);
    TaskResponseDto getTaskById(Long id);
    List getAllTask();
}