package com.roomih.orderapi.dto;

import lombok.Data;
import java.time.LocalDate;

import com.roomih.orderapi.dto.PublicationDto;
import com.roomih.orderapi.dto.UserDto;

@Data
public class SubscriptionDto {
    private Long id;
    private UserDto user;
    private PublicationDto publication;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalPrice;
    private Integer quantity;
}
