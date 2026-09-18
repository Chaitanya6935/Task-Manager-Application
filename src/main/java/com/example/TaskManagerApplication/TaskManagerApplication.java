package com.example.TaskManagerApplication;

import com.example.TaskManagerApplication.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

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
}
