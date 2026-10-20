package com.example.TaskManagerApplication.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegistrationResponseDto {

    private Long userId;
    private String name;
    private String email;
    private String phone;
}