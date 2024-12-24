package com.roomih.orderapi.rest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.roomih.orderapi.dto.AuthResponse;
import com.roomih.orderapi.dto.LoginRequest;
import com.roomih.orderapi.dto.LoginResponse;
import com.roomih.orderapi.dto.SignUpRequest;
import com.roomih.orderapi.exception.DuplicatedUserInfoException;
import com.roomih.orderapi.model.User;
import com.roomih.orderapi.security.TokenProvider;
import com.roomih.orderapi.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth Controller", description = "API для аутентификации")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Operation(
        summary = "Аутентификация пользователя",
        responses = {
            @ApiResponse(responseCode = "200", description = "Успешная аутентификация"),
            @ApiResponse(responseCode = "401", description = "Неверные учетные данные")
        }
    )
    @PostMapping("/authenticate")
    @Transactional
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Authentication attempt for user: {}", loginRequest.getEmail());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            String token = tokenProvider.generate(authentication);
            log.info("Authentication successful for user: {}", loginRequest.getEmail());

            User user = userService.validateAndGetUserByEmail(loginRequest.getEmail());
            return ResponseEntity.ok(new LoginResponse(token, user.getEmail(), user.getRole()));
        } catch (Exception e) {
            log.error("Authentication error: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Неверное имя пользователя или пароль"));
        }
    }

    @Operation(
        summary = "Регистрация нового пользователя",
        responses = {
            @ApiResponse(responseCode = "201", description = "Пользователь успешно зарегистрирован"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные")
        }
    )
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/signup")
    @Transactional
    public AuthResponse signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userService.hasUserWithEmail(signUpRequest.getEmail())) {
            throw new DuplicatedUserInfoException(String.format("Email %s already been used", signUpRequest.getEmail()));
        }

        User user = new User();
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setEmail(signUpRequest.getEmail());
        user.setRole("USER");
        userService.saveUser(user);

        String token = authenticateAndGetToken(signUpRequest.getEmail(), signUpRequest.getPassword());
        return new AuthResponse(token);
    }

    private String authenticateAndGetToken(String email, String password) {
        log.debug("Attempting to authenticate user: {}", email);
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, password)
        );
        log.debug("Authentication successful. Generating token for user: {}", email);
        return tokenProvider.generate(authentication);
    }
}
