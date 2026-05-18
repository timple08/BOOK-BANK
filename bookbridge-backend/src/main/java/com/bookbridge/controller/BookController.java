package com.bookbridge.controller;

import com.bookbridge.dto.BookDto;
import com.bookbridge.dto.BookRequest;
import com.bookbridge.entity.BookType;
import com.bookbridge.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<List<BookDto>> getAllBooks(
            @RequestParam(required = false) BookType type
    ) {
        if (type != null) {
            return ResponseEntity.ok(bookService.getBooksByType(type));
        }
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/my-listings")
    public ResponseEntity<List<BookDto>> getMyListings(Authentication authentication) {
        return ResponseEntity.ok(bookService.getMyBooks(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDto> getBookById(@PathVariable Integer id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @PostMapping
    public ResponseEntity<BookDto> createBook(
            @RequestBody BookRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(bookService.createBook(request, authentication.getName()));
    }
}
