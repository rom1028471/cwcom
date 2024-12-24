package com.roomih.orderapi.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateSubscriptionRequest {
    @NotNull
    private Long publicationId;
    
    @NotNull
    private Integer durationMonths;

    @NotNull
    @Min(1)
    private Integer quantity = 1;

    private Double totalPrice;
}
