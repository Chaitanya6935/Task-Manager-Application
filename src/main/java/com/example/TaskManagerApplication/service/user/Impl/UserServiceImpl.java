package com.example.TaskManagerApplication.service.user.Impl;

//import com.example.TaskManagerApplication.config.PasswordConfig;
import com.example.TaskManagerApplication.dto.UserRegistrationRequestDto;
import com.example.TaskManagerApplication.dto.UserRegistrationResponseDto;
import com.example.TaskManagerApplication.dto.login.LoginRequestDto;
import com.example.TaskManagerApplication.dto.login.LoginResponseDto;
import com.example.TaskManagerApplication.entity.User;
import com.example.TaskManagerApplication.exception.DuplicateResourceException;
import com.example.TaskManagerApplication.exception.InvalidCredentialException;
import com.example.TaskManagerApplication.repository.UserRepository;
import com.example.TaskManagerApplication.security.CustomUserDetails;
import com.example.TaskManagerApplication.security.JwtService;
import com.example.TaskManagerApplication.service.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder ,JwtService jwtService,AuthenticationManager authenticationManager){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public UserRegistrationResponseDto registration(UserRegistrationRequestDto userRegistrationRequestDto) {

        if(!userRegistrationRequestDto.getPassword().equals(userRegistrationRequestDto.getConfPassword())){
            throw new DuplicateResourceException("password and confirm do not match");
        }

        if(userRepository.existsByEmail(userRegistrationRequestDto.getEmail())){
            throw new DuplicateResourceException("Email address already exist"+userRegistrationRequestDto.getEmail());
        }

        if(userRepository.existsByPhone(userRegistrationRequestDto.getPhone())){
            throw new DuplicateResourceException("Phone number already exist"+userRegistrationRequestDto.getPhone());
        }

        User user = new User();
        user.setEmail((userRegistrationRequestDto.getEmail()));
        user.setName(userRegistrationRequestDto.getName());
        user.setPhone(userRegistrationRequestDto.getPhone());
        user.setPassword(passwordEncoder.encode(userRegistrationRequestDto.getPassword()));

        User saved = userRepository.save(user);

        UserRegistrationResponseDto dto = new UserRegistrationResponseDto();
        dto.setName(saved.getName());
        dto.setEmail(saved.getEmail());
        dto.setPhone(saved.getPhone());
        dto.setUserId(saved.getId());

        return dto;
    }

    @Override
    public LoginResponseDto Login(LoginRequestDto requestDto) {

//        // 1. Load by email — same error for "not found" and "wrong password"
//        User user = userRepository.findByEmail(requestDto.getEmail())
//                .orElseThrow(() -> new InvalidCredentialException("Invalid email or password"));
//
//        // 2. Verify password with BCrypt
//        if (!passwordEncoder.matches(requestDto.getPassword(), user.getPassword())) {
//            throw new InvalidCredentialException("Invalid email or password");
//        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        requestDto.getEmail(),
                        requestDto.getPassword()
                )
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        String jwtToken = jwtService.generateToken(userDetails);
        // 3. Build response
        return new LoginResponseDto(
                "Login successful",

                userDetails.getUserId(),
                userDetails.getName(),
                userDetails.getUsername(),
                userDetails.getPhone(),
                jwtToken
        );
    }

}
