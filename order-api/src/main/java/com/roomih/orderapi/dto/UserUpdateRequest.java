package com.roomih.orderapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequest {
    @NotBlank(message = "Имя не может быть пустым")
    @Size(min = 2, max = 50, message = "Имя должно содержать от 2 до 50 символов")
    private String name;

    @NotBlank(message = "Адрес не может быть пустым")
    @Size(min = 5, max = 200, message = "Адрес должен содержать от 5 до 200 символов")
    private String address;

    @NotBlank(message = "Город не может быть пустым")
    @Size(min = 2, max = 50, message = "Название города должно содержать от 2 до 50 символов")
    private String city;

    @NotBlank(message = "Почтовый индекс не может быть пустым")
    @Pattern(regexp = "\\d{6}", message = "Почтовый индекс должен содержать 6 цифр")
    private String postalCode;

    @NotBlank(message = "Номер телефона не может быть пустым")
    @Pattern(regexp = "\\+7\\d{10}", message = "Номер телефона должен быть в формате +7XXXXXXXXXX")
    private String phoneNumber;
}
