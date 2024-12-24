package com.roomih.orderapi.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignUpRequest {

    @Schema(example = "John")
    @NotBlank
    private String firstName;

    @Schema(example = "Doe")
    @NotBlank
    private String lastName;

    @Schema(example = "user3")
    @NotBlank
    private String username;

    @Schema(example = "password")
    @NotBlank
    private String password;

    @Schema(example = "user3@mycompany.com")
    @Email
    private String email;
}
