package com.roomih.orderapi.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubscriptionRequest {
    @NotNull(message = "ID публикации обязателен")
    private Long publicationId;

    @NotNull(message = "Период подписки обязателен")
    @Min(value = 1, message = "Период подписки должен быть не менее 1 месяца")
    private Integer subscriptionPeriod;

    @NotNull(message = "Количество экземпляров обязательно")
    @Min(value = 1, message = "Количество должно быть не менее 1")
    private Integer quantity;

    @NotNull(message = "Общая стоимость обязательна")
    @Min(value = 0, message = "Общая стоимость не может быть отрицательной")
    private Double totalPrice;
} 