package com.example.TaskManagerApplication.controller;

import com.example.TaskManagerApplication.dto.taskDto.TaskResponseDto;
import com.example.TaskManagerApplication.entity.User;
import com.example.TaskManagerApplication.exception.GlobalExceptionHandler;
import com.example.TaskManagerApplication.security.*;
import com.example.TaskManagerApplication.service.Task.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

//@WebMvcTest(TaskController.class)
//// CRITICAL: Do NOT set addFilters = false here. Allow the security filters to run.
//@AutoConfigureMockMvc
//@Import(GlobalExceptionHandler.class)
//class TaskControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockitoBean
//    private TaskService taskService;
//
//    // These mocks satisfy the constructor dependencies of beans that @WebMvcTest scans.
//    // Because filters are now enabled, these are necessary to prevent context startup failure.
//    @MockitoBean
//    private JwtService jwtService;
//
//    @MockitoBean
//    private CustomUserDetailsService customUserDetailsService;
//
//    @MockitoBean
//    private JwtAuthenticationFilter jwtAuthenticationFilter;
//
//    @MockitoBean
//    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
//
//    /**
//     * Helper to create a real CustomUserDetails object.
//     */
//    private CustomUserDetails buildUserDetails(Long id, String email) {
//        User user = new User();
//        user.setId(id);
//        user.setEmail(email);
//        user.setPassword("password");
//        user.setName("Test User");
//        user.setPhone("9999999999");
//        return new CustomUserDetails(user);
//    }
//
//    @Test
//    void getTaskById_WithMockedUser_Returns200() throws Exception {
//        // 1. Create the real principal object
//        CustomUserDetails userDetails = buildUserDetails(1L, "test@example.com");
//
//        // 2. Stub the service layer
//        TaskResponseDto responseDto = new TaskResponseDto();
//        responseDto.setId(1L);
//        responseDto.setTitle("Mocked Task");
//        when(taskService.getTaskById(1L, 1L)).thenReturn(responseDto);
//
//        // 3. Perform request WITH the user post-processor
//        mockMvc.perform(get("/api/tasks/1")
//                        .with(user(userDetails)) // This now works because filters are on
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.title").value("Mocked Task"));
//    }
//
//    @Test
//    void createTask_WithInvalidBody_Returns400() throws Exception {
//        mockMvc.perform(post("/api/tasks")
//                        .with(user(buildUserDetails(1L, "test@example.com"))) // Inject user here too
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content("{}"))
//                .andExpect(status().isBadRequest());
//    }
//}

@WebMvcTest(TaskController.class)
// Remove addFilters = false, allow validation and Security to work normally
@Import({GlobalExceptionHandler.class, SecurityConfig.class}) // Import your actual Security configuration class
class TaskControllerTest {

    @Autowired MockMvc mockMvc;
    @MockitoBean TaskService taskService;
    @MockitoBean JwtService jwtService;
    @MockitoBean CustomUserDetailsService customUserDetailsService;
    @MockitoBean JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    // Note: JwtAuthenticationFilter does not need to be mocked, otherwise the security chain will be missing

    private CustomUserDetails buildUserDetails(Long id, String email) {
        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setPassword("pwd");
        user.setName("Test");
        user.setPhone("9999999999");
        return new CustomUserDetails(user);
    }

    @Test
    void getTaskById_WithMockedUser_Returns200() throws Exception {
        CustomUserDetails userDetails = buildUserDetails(1L, "test@example.com");

        TaskResponseDto dto = new TaskResponseDto();
        dto.setId(1L);
        dto.setTitle("Mocked Task");
        when(taskService.getTaskById(1L, 1L)).thenReturn(dto);

        mockMvc.perform(get("/api/tasks/1")
                        .with(user(userDetails))  // Use real CustomUserDetails
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Mocked Task"));
    }

    @Test
    void createTask_WithInvalidBody_Returns400() throws Exception {
        mockMvc.perform(post("/api/tasks")
                        .with(user(buildUserDetails(1L, "test@example.com")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest()); // Now @Valid will take effect
    }
}