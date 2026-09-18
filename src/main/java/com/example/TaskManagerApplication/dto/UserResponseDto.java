package com.example.TaskManagerApplication.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDto {

    private Long userId;
    private String name;
    private String email;
    private String phone;
}