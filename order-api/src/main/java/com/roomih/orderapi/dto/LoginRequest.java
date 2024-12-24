package com.roomih.orderapi.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @Schema(example = "user@a.co")
    @NotBlank
    private String email;

    @Schema(example = "password")
    @NotBlank
    private String password;
}
