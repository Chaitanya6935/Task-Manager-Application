package com.example.TaskManagerApplication.service.user;

import com.example.TaskManagerApplication.dto.UserRegistrationRequestDto;
import com.example.TaskManagerApplication.dto.UserRegistrationResponseDto;
import com.example.TaskManagerApplication.dto.login.LoginRequestDto;
import com.example.TaskManagerApplication.dto.login.LoginResponseDto;
import org.springframework.http.ResponseEntity;

public interface UserService {

    LoginResponseDto Login(LoginRequestDto loginRequestDto);
    UserRegistrationResponseDto registration(UserRegistrationRequestDto userRegistrationRequestDto);
}
