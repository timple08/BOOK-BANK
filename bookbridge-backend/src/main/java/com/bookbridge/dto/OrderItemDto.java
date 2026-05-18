package com.bookbridge.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class OrderItemDto {
    private Integer id;
    private Integer bookId;
    private String bookTitle;
    private BigDecimal price;
    private Integer quantity;
}
