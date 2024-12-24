package com.roomih.orderapi.dto;

import com.roomih.orderapi.model.PublicationType;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class PublicationDto {
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
    private String description;

    @NotBlank(message = "Publisher is required")
    @Size(min = 2, max = 100, message = "Publisher must be between 2 and 100 characters")
    private String publisher;

    @NotNull(message = "Publication type is required")
    private PublicationType type;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @DecimalMax(value = "1000.00", message = "Price must be less than 1000")
    private Double pricePerMonth;

    private String imageUrl;
}
