package com.bookbridge.dto;

import com.bookbridge.entity.ExchangeStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ExchangeDto {
    private Integer id;
    private Integer proposerId;
    private String proposerName;
    private Integer targetUserId;
    private String targetUserName;
    private Integer offeredBookId;
    private String offeredBookTitle;
    private Integer requestedBookId;
    private String requestedBookTitle;
    private ExchangeStatus status;
    private LocalDateTime createdAt;
}
