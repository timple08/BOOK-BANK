package com.bookbridge.dto;

import lombok.Data;

@Data
public class ExchangeRequestPayload {
    private Integer targetUserId;
    private Integer offeredBookId;
    private Integer requestedBookId;
}
