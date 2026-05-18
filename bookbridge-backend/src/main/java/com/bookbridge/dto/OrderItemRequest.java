package com.bookbridge.dto;

import lombok.Data;

@Data
public class OrderItemRequest {
    private Integer bookId;
    private Integer quantity;
}
