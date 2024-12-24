package com.roomih.orderapi.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.roomih.orderapi.dto.UserDto;
import com.roomih.orderapi.mapper.UserMapper;
import com.roomih.orderapi.model.Subscription;
import com.roomih.orderapi.model.User;
import com.roomih.orderapi.security.CustomUserDetails;
import com.roomih.orderapi.service.SubscriptionService;
import com.roomih.orderapi.service.UserService;

import static com.roomih.orderapi.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
@Tag(name = "User Controller", description = "API для управления пользователями")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final SubscriptionService subscriptionService;

    @Operation(
        summary = "Получить информацию о текущем пользователе",
        responses = {
            @ApiResponse(responseCode = "200", description = "Успешное получение данных"),
            @ApiResponse(responseCode = "401", description = "Не авторизован")
        },
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/me")
    public UserDto getCurrentUser(@AuthenticationPrincipal CustomUserDetails currentUser) {
        log.info("Getting current user info for user: {}", currentUser.getEmail());
        User user = userService.validateAndGetUserByEmail(currentUser.getEmail());
        return userMapper.toUserDto(user);
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @GetMapping
    public List<UserDto> getUsers() {
        return userService.getUsers().stream()
                .map(userMapper::toUserDto)
                .collect(Collectors.toList());
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @GetMapping("/{email}")
    public UserDto getUser(@PathVariable String email) {
        return userMapper.toUserDto(userService.validateAndGetUserByEmail(email));
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @DeleteMapping("/{email}")
    public UserDto deleteUser(@PathVariable String email) {
        User user = userService.validateAndGetUserByEmail(email);
        userService.deleteUser(user);
        return userMapper.toUserDto(user);
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @GetMapping("/profile")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal CustomUserDetails currentUser) {
        try {
            log.info("Fetching profile for user: {}", currentUser.getEmail());
            
            User user = userService.validateAndGetUserByEmail(currentUser.getEmail());
            if (user == null) {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Ошибка", "Пользователь не найден"));
            }
            
            UserDto userDto = userMapper.toUserDto(user);
            return ResponseEntity.ok(userDto);
        } catch (Exception e) {
            log.error("Error fetching profile for user: {}", currentUser.getEmail(), e);
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Ошибка", "Не удалось загрузить профиль"));
        }
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @PutMapping("/profile")
    @Transactional
    public ResponseEntity<?> updateUserProfile(
        @AuthenticationPrincipal CustomUserDetails currentUser,
        @RequestBody UserDto userDto
    ) {
        try {
            log.info("Updating profile for user: {}", currentUser.getEmail());
            
            User user = userService.validateAndGetUserByEmail(currentUser.getEmail());
            if (user == null) {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Ошибка", "Пользователь не найден"));
            }

            // Проверяем, что обновляется профиль текущего пользователя
            if (userDto.getId() != null && !userDto.getId().equals(user.getId())) {
                log.error("Attempt to update different user profile. Token user ID: {}, DTO user ID: {}", 
                    user.getId(), userDto.getId());
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Ошибка", "Недопустимая операция"));
            }

            // Обновляем только разрешенные поля
            if (userDto.getName() != null) {
                user.setName(userDto.getName());
            }
            if (userDto.getAddress() != null) {
                user.setAddress(userDto.getAddress());
            }
            if (userDto.getCity() != null) {
                user.setCity(userDto.getCity());
            }
            if (userDto.getPostalCode() != null) {
                user.setPostalCode(userDto.getPostalCode());
            }
            if (userDto.getPhoneNumber() != null) {
                user.setPhoneNumber(userDto.getPhoneNumber());
            }

            User updatedUser = userService.saveUser(user);
            log.info("Successfully updated profile for user: {}", currentUser.getEmail());
            return ResponseEntity.ok(userMapper.toUserDto(updatedUser));
        } catch (Exception e) {
            log.error("Error updating profile for user: {}", currentUser.getEmail(), e);
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Ошибка", "Не удалось обновить профиль"));
        }
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @PutMapping("/change-password")
    public ResponseEntity<?> changeUserPassword(
        @AuthenticationPrincipal CustomUserDetails currentUser,
        @RequestBody ChangePasswordRequest changePasswordRequest
    ) {
        try {
            log.info("Changing password for user: {}", currentUser.getEmail());
            
            User user = userService.validateAndGetUserByEmail(currentUser.getEmail());
            
            if (!userService.checkPassword(user, changePasswordRequest.getCurrentPassword())) {
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Ошибка", "Текущий пароль введен неверно"));
            }
            
            if (changePasswordRequest.getNewPassword().length() < 6) {
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Ошибка", "Пароль должен содержать не менее 6 символов"));
            }
            
            userService.changeUserPassword(user, changePasswordRequest.getNewPassword());
            
            log.info("Password changed successfully for user: {}", currentUser.getEmail());
            return ResponseEntity.ok(new SuccessResponse("Пароль успешно изменен"));
        } catch (RuntimeException e) {
            log.error("Error changing password for user: {}", currentUser.getEmail(), e);
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Не удалось изменить пароль", e.getMessage()));
        }
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @GetMapping("/subscriptions")
    public ResponseEntity<List<Subscription>> getUserSubscriptions(@AuthenticationPrincipal CustomUserDetails currentUser) {
        try {
            User user = userService.validateAndGetUserByEmail(currentUser.getEmail());
            List<Subscription> subscriptions = subscriptionService.getUserSubscriptions(user);
            return ResponseEntity.ok(subscriptions);
        } catch (RuntimeException e) {
            log.error("Error fetching subscriptions for user: {}", currentUser.getEmail(), e);
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(null);
        }
    }

    // Вложнный класс для обработки ошибок
    public static class ErrorResponse {
        private final String message;
        private final String details;

        public ErrorResponse(String message, String details) {
            this.message = message;
            this.details = details;
        }

        public String getMessage() { return message; }
        public String getDetails() { return details; }
    }

    // DTO ля запроса смены пароля
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;

        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    // Класс для успешного ответа
    public static class SuccessResponse {
        private final String message;

        public SuccessResponse(String message) {
            this.message = message;
        }

        public String getMessage() { return message; }
    }
}
