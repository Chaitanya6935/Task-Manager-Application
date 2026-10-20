package com.example.TaskManagerApplication.controller;

import com.example.TaskManagerApplication.dto.taskDto.TaskResponseDto;
import com.example.TaskManagerApplication.security.CustomUserDetails;
import com.example.TaskManagerApplication.security.CustomUserDetailsService;
import com.example.TaskManagerApplication.security.JwtAuthenticationFilter;
import com.example.TaskManagerApplication.security.JwtService;
import com.example.TaskManagerApplication.service.Task.TaskService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private TaskService taskService;

    // We must mock these because @WebMvcTest loads SecurityConfig and the JwtFilter
    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    // ==========================================
    // TEST 1: Access Denied without Token (401)
    // ==========================================
    @Test
    void getTaskById_WithoutToken_Returns401() throws Exception {
        mockMvc.perform(get("/api/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    // ==========================================
    // TEST 2: Access Granted with Token (200)
    // ==========================================
    @Test
    @WithMockUser(username = "test@example.com") // Simulates a valid authenticated user
    void getTaskById_WithToken_Returns200() throws Exception {
        // Arrange: Mock the service returning a task
        TaskResponseDto responseDto = new TaskResponseDto();
        responseDto.setId(1L);
        responseDto.setTitle("Mocked Task");

        when(taskService.getTaskById(anyLong(), anyLong())).thenReturn(responseDto);

        // Act & Assert
        mockMvc.perform(get("/api/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    // ==========================================
    // TEST 3: Validation Fails (400)
    // ==========================================
    @Test
    @WithMockUser
    void createTask_WithInvalidBody_Returns400() throws Exception {
        // Empty JSON body violates @NotBlank on title/startDate/dueDate
        String invalidJson = "{}";

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }
}