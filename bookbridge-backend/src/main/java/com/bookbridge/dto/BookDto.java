package com.bookbridge.dto;

import com.bookbridge.entity.BookCondition;
import com.bookbridge.entity.BookType;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class BookDto {
    private Integer id;
    private String title;
    private String author;
    private String description;
    private String categoryName;
    private BookType type;
    private BookCondition condition;
    private BigDecimal sellingPrice;
    private BigDecimal originalPrice;
    private String imageUrl;
    private String sellerName;
    private Integer sellerId;
}
