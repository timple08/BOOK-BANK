package com.bookbridge.dto;

import com.bookbridge.entity.BookCondition;
import com.bookbridge.entity.BookType;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class BookRequest {
    private String title;
    private String author;
    private String isbn;
    private String description;
    private Integer categoryId;
    private BookType type;
    private BookCondition condition;
    private BigDecimal sellingPrice;
    private BigDecimal originalPrice;
    private String imageUrl;
}
