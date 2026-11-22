
package com.example.TaskManagerApplication.controller;

import com.example.TaskManagerApplication.dto.UserRegistrationRequestDto;
import com.example.TaskManagerApplication.dto.UserRegistrationResponseDto;
import com.example.TaskManagerApplication.dto.login.LoginRequestDto;
import com.example.TaskManagerApplication.dto.login.LoginResponseDto;
import com.example.TaskManagerApplication.service.user.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // User Registration
    @PostMapping("/register")
    public ResponseEntity<UserRegistrationResponseDto> register(
            @Valid @RequestBody UserRegistrationRequestDto dto) {

        UserRegistrationResponseDto response =
                userService.registration(dto);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(
            @Valid @RequestBody LoginRequestDto requestDto) {

        LoginResponseDto response = userService.Login(requestDto);

        return ResponseEntity.ok(response);
    }
}
