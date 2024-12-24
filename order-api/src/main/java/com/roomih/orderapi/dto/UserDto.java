package com.roomih.orderapi.dto;

import java.time.ZonedDateTime;
import java.util.List;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String email;
    private String name;
    private String role;
    private String address;
    private String city;
    private String postalCode;
    private String phoneNumber;
    private List<OrderDto> orders;

    public UserDto(Long id, String email, String name, String role, String address, 
                  String city, String postalCode, String phoneNumber, List<OrderDto> orders) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.address = address;
        this.city = city;
        this.postalCode = postalCode;
        this.phoneNumber = phoneNumber;
        this.orders = orders;
    }

    @Data
    public static class OrderDto {
        private String id;
        private String description;
        private ZonedDateTime createdAt;
    }
}