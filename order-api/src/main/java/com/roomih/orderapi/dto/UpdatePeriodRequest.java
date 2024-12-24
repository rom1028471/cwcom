package com.roomih.orderapi.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdatePeriodRequest {
    @NotNull(message = "Период подписки обязателен")
    @Min(value = 1, message = "Период подписки должен быть не менее 1 месяца")
    @Max(value = 12, message = "Период подписки не может быть более 12 месяцев")
    private Integer subscriptionPeriod;
} 