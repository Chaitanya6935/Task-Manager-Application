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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Tells JUnit 5 to use Mockito
@ActiveProfiles("test") // 👈 Add this line!
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    private User mockUser;
    private Task mockTask;
    private TaskRequestDto requestDto;

    // This runs BEFORE every single test to set up fresh data
    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");
        mockUser.setName("Test User");

        requestDto = new TaskRequestDto();
        requestDto.setTitle("Test Task");
        requestDto.setDescription("Test Description");
        requestDto.setDuration(60);
        requestDto.setStartDate(LocalDate.now());
        requestDto.setDueDate(LocalDate.now().plusDays(1));
        requestDto.setPriority(Priority.HIGH);

        mockTask = new Task();
        mockTask.setId(100L);
        mockTask.setTitle("Test Task");
        mockTask.setUser(mockUser);
        mockTask.setStatus(TaskStatus.TODO);
    }

    // ==========================================
    // TEST 1: Create Task (Success)
    // ==========================================
    @Test
    void createTask_Success() {
        // 1. Stub the mock repositories (Tell them what to return)
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(taskRepository.save(any(Task.class))).thenReturn(mockTask);

        // 2. Call the real service method
        TaskResponseDto response = taskService.createTask(requestDto, 1L);

        // 3. Assert (Verify) the results
        assertNotNull(response);
        assertEquals("Test Task", response.getTitle());
        assertEquals(1L, response.getUserId());
        assertEquals(TaskStatus.TODO, response.getStatus());

        // 4. Verify that the repository save() method was actually called
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    // ==========================================
    // TEST 2: Create Task (User Not Found)
    // ==========================================
    @Test
    void createTask_ThrowsException_WhenUserNotFound() {
        // Stub userRepository to return empty
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        // Assert that calling the service throws ResourceNotFoundException
        assertThrows(ResourceNotFoundException.class, () -> {
            taskService.createTask(requestDto, 99L);
        });

        // Verify save() was NEVER called because it failed early
        verify(taskRepository, never()).save(any(Task.class));
    }

    // ==========================================
    // TEST 3: Get Task By ID (Success)
    // ==========================================
    @Test
    void getTaskById_Success() {
        when(taskRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(mockTask));

        TaskResponseDto response = taskService.getTaskById(100L, 1L);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("Test Task", response.getTitle());
    }

    // ==========================================
    // TEST 4: Get Task By ID (Not Found / Wrong User)
    // ==========================================
    @Test
    void getTaskById_ThrowsException_WhenTaskNotFoundOrWrongUser() {
        when(taskRepository.findByIdAndUserId(999L, 1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            taskService.getTaskById(999L, 1L);
        });
    }

    // ==========================================
    // TEST 5: Delete Task (Success)
    // ==========================================
    @Test
    void deleteTask_Success() {
        when(taskRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(mockTask));
        doNothing().when(taskRepository).delete(mockTask); // Mock void method

        taskService.DeleteById(100L, 1L);

        verify(taskRepository, times(1)).delete(mockTask);
    }
}