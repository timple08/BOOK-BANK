package com.bookbridge.controller;

import com.bookbridge.dto.OrderDto;
import com.bookbridge.dto.OrderRequest;
import com.bookbridge.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(
            @RequestBody OrderRequest request,
            Authentication auth
    ) {
        return ResponseEntity.ok(orderService.createOrder(request, auth.getName()));
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getMyOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getMyOrders(auth.getName()));
    }
}
