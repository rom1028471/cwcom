package com.roomih.orderapi.exception;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ErrorResponse {
    private int status;
    private String message;
    private Object details;
    private LocalDateTime timestamp;

    public ErrorResponse(int status, String message, Object details) {
        this.status = status;
        this.message = message;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }
}
