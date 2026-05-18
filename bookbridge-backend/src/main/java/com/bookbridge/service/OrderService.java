package com.bookbridge.service;

import com.bookbridge.dto.OrderDto;
import com.bookbridge.dto.OrderItemDto;
import com.bookbridge.dto.OrderRequest;
import com.bookbridge.entity.*;
import com.bookbridge.repository.BookRepository;
import com.bookbridge.repository.OrderRepository;
import com.bookbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public OrderDto createOrder(OrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();

        Order order = Order.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .status(OrderStatus.PENDING)
                .items(new ArrayList<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (var itemReq : request.getItems()) {
            Book book = bookRepository.findById(itemReq.getBookId()).orElseThrow();
            BigDecimal itemTotal = book.getSellingPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .book(book)
                    .price(book.getSellingPrice())
                    .quantity(itemReq.getQuantity())
                    .build();
            order.getItems().add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        return mapToDto(orderRepository.save(order));
    }

    public List<OrderDto> getMyOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        return orderRepository.findByUserId(user.getId())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private OrderDto mapToDto(Order order) {
        return OrderDto.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .createdAt(order.getCreatedAt())
                .items(order.getItems().stream().map(item -> OrderItemDto.builder()
                        .id(item.getId())
                        .bookId(item.getBook().getId())
                        .bookTitle(item.getBook().getTitle())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .build()).collect(Collectors.toList()))
                .build();
    }
}
