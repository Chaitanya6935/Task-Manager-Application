package com.example.TaskManagerApplication.service.user.Impl;

//public class UserServiceImplTest {
//}
//
//
//package com.example.TaskManagerApplication.service.user.impl;

import com.example.TaskManagerApplication.dto.UserRegistrationRequestDto;
import com.example.TaskManagerApplication.dto.login.LoginRequestDto;
import com.example.TaskManagerApplication.dto.login.LoginResponseDto;
import com.example.TaskManagerApplication.entity.User;
import com.example.TaskManagerApplication.exception.DuplicateResourceException;
import com.example.TaskManagerApplication.repository.UserRepository;
import com.example.TaskManagerApplication.security.CustomUserDetails;
import com.example.TaskManagerApplication.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
        import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private UserServiceImpl userService;

    private UserRegistrationRequestDto registerDto;
    private User mockUser;

    @BeforeEach
    void setUp() {
        // Setup Registration DTO
        registerDto = new UserRegistrationRequestDto();
        registerDto.setName("Test User");
        registerDto.setEmail("test@example.com");
        registerDto.setPhone("1234567890");
        registerDto.setPassword("Password@123");
        registerDto.setConfPassword("Password@123");

        // Setup Mock User
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("Test User");
        mockUser.setEmail("test@example.com");
        mockUser.setPhone("1234567890");
        mockUser.setPassword("hashed_password");
    }

    // ==========================================
    // TEST 1: Register Success
    // ==========================================
    @Test
    void register_Success() {
        // Stub repository to say "no duplicate email/phone"
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByPhone(anyString())).thenReturn(false);

        // Stub password encoder to return a hash
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_password");

        // Stub save to return the user
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        // Call the service
        var response = userService.registration(registerDto);

        // Assertions
        assertNotNull(response);
        assertEquals("Test User", response.getName());
        assertEquals("test@example.com", response.getEmail());

        // Verify the encoder was called exactly once
        verify(passwordEncoder, times(1)).encode("Password@123");
        verify(userRepository, times(1)).save(any(User.class));
    }

    // ==========================================
    // TEST 2: Register - Duplicate Email
    // ==========================================
    @Test
    void register_ThrowsException_WhenEmailExists() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // Assert exception is thrown
        assertThrows(DuplicateResourceException.class, () -> {
            userService.registration(registerDto);
        });

        // Verify save is never called
        verify(userRepository, never()).save(any(User.class));
    }

    // ==========================================
    // TEST 3: Register - Duplicate Phone
    // ==========================================
    @Test
    void register_ThrowsException_WhenPhoneExists() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false); // Email is fine
        when(userRepository.existsByPhone(anyString())).thenReturn(true);  // Phone is duplicate

        assertThrows(DuplicateResourceException.class, () -> {
            userService.registration(registerDto);
        });

        verify(userRepository, never()).save(any(User.class));
    }

    // ==========================================
    // TEST 4: Login Success
    // ==========================================
    @Test
    void login_Success() {
        LoginRequestDto loginDto = new LoginRequestDto();
        loginDto.setEmail("test@example.com");
        loginDto.setPassword("Password@123");

        // Mock Spring Security's Authentication object
        CustomUserDetails userDetails = new CustomUserDetails(mockUser);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(userDetails);

        // Stub AuthenticationManager to return successful auth
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(auth);

        // Stub JwtService to return a fake token
        when(jwtService.generateToken(any(CustomUserDetails.class))).thenReturn("fake-jwt-token");

        // Call service
        LoginResponseDto response = userService.Login(loginDto);

        // Assertions
        assertNotNull(response);
        assertEquals("fake-jwt-token", response.getToken());
        assertEquals("test@example.com", response.getEmail());
    }

    // ==========================================
    // TEST 5: Login Failure (Wrong Password)
    // ==========================================
    @Test
    void login_ThrowsException_WhenBadCredentials() {
        LoginRequestDto loginDto = new LoginRequestDto();
        loginDto.setEmail("test@example.com");
        loginDto.setPassword("WrongPassword");

        // Stub AuthenticationManager to throw an exception
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // Assert exception is thrown
        assertThrows(BadCredentialsException.class, () -> {
            userService.Login(loginDto);
        });

        // Verify JWT is NEVER generated
        verify(jwtService, never()).generateToken(any());
    }
}