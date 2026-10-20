package com.example.TaskManagerApplication;

import com.example.TaskManagerApplication.repository.UserRepository;
import com.example.TaskManagerApplication.security.JwtService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@SpringBootApplication
public class TaskManagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaskManagerApplication.class, args);
	}
//	@Bean
//    CommandLineRunner test(UserRepository userRepo) {
//		return args -> {
//			System.out.println("User count: " + userRepo.count());
//			System.out.println("Email exists: " + userRepo.existsByEmail("test@example.com"));
//		};
//	}



//	@Bean
//	CommandLineRunner testJwt(JwtService jwtService,
//                              com.example.TaskManagerApplication.repository.UserRepository userRepo) {
//		return args -> {
//			var userOpt = userRepo.findByEmail("chaitanya@example.com");
//			if (userOpt.isEmpty()) {
//				System.out.println(">>> No user found — register one first, then retest");
//				return;
//			}
//			var details = new com.example.TaskManagerApplication.security.CustomUserDetails(userOpt.get());
//			String token = jwtService.generateToken(details);
//			System.out.println(">>> TOKEN: " + token);
//			System.out.println(">>> USERNAME: " + jwtService.extractUsername(token));
//			System.out.println(">>> USER ID: " + jwtService.extractUserId(token));
//			System.out.println(">>> VALID: " + jwtService.isTokenValid(token, details));
//		};
//	}


//	@Bean
//	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//		System.out.println(">>> SecurityFilterChain built — permitAll: /api/users/register, /api/users/login");
////		http ... (rest unchanged)
//		return http.build();
//	}
}
