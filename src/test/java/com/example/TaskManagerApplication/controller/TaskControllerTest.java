package com.example.TaskManagerApplication.controller;

import com.example.TaskManagerApplication.dto.taskDto.TaskResponseDto;
import com.example.TaskManagerApplication.exception.GlobalExceptionHandler;
import com.example.TaskManagerApplication.security.CustomUserDetailsService;
import com.example.TaskManagerApplication.security.JwtAuthenticationEntryPoint;
import com.example.TaskManagerApplication.security.JwtAuthenticationFilter;
import com.example.TaskManagerApplication.security.JwtService;
import com.example.TaskManagerApplication.service.Task.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TaskController.class)
@AutoConfigureMockMvc(addFilters = false) // Disables security filters for controller logic tests
@Import(GlobalExceptionHandler.class)     // Ensures 400 Bad Request works for @Valid
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TaskService taskService;

    // The following 4 mocks are required because @WebMvcTest auto-scans @Component JwtAuthenticationFilter
    // and we must satisfy its constructor dependencies.
    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Test
    @WithMockUser(username = "test@example.com")
    void getTaskById_WithMockedUser_Returns200() throws Exception {
        TaskResponseDto responseDto = new TaskResponseDto();
        responseDto.setId(1L);
        responseDto.setTitle("Mocked Task");

        when(taskService.getTaskById(anyLong(), anyLong())).thenReturn(responseDto);

        mockMvc.perform(get("/api/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Mocked Task"));
    }

    @Test
    @WithMockUser
    void createTask_WithInvalidBody_Returns400() throws Exception {
        mockMvc.perform(post("/api/tasks")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}