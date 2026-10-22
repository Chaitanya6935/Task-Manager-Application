package com.example.TaskManagerApplication.dto.login;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponseDto {

    String message;
    Long userId;
    String name;
    String email;
    String phone;
    String token;


}
