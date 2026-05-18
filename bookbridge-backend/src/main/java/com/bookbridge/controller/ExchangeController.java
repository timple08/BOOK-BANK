package com.bookbridge.controller;

import com.bookbridge.dto.ExchangeDto;
import com.bookbridge.dto.ExchangeRequestPayload;
import com.bookbridge.entity.ExchangeStatus;
import com.bookbridge.service.ExchangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/exchange")
@RequiredArgsConstructor
public class ExchangeController {

    private final ExchangeService exchangeService;

    @PostMapping
    public ResponseEntity<ExchangeDto> createRequest(@RequestBody ExchangeRequestPayload payload, Authentication auth) {
        return ResponseEntity.ok(exchangeService.createExchangeRequest(payload, auth.getName()));
    }

    @GetMapping("/incoming")
    public ResponseEntity<List<ExchangeDto>> getIncomingRequests(Authentication auth) {
        return ResponseEntity.ok(exchangeService.getIncomingRequests(auth.getName()));
    }

    @GetMapping("/outgoing")
    public ResponseEntity<List<ExchangeDto>> getOutgoingRequests(Authentication auth) {
        return ResponseEntity.ok(exchangeService.getOutgoingRequests(auth.getName()));
    }

    @PutMapping("/{id}/respond")
    public ResponseEntity<ExchangeDto> respondToRequest(
            @PathVariable Integer id,
            @RequestParam ExchangeStatus status,
            Authentication auth
    ) {
        return ResponseEntity.ok(exchangeService.respondToRequest(id, status, auth.getName()));
    }
}
