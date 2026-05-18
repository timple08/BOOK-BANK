package com.bookbridge.service;

import com.bookbridge.dto.BookDto;
import com.bookbridge.dto.BookRequest;
import com.bookbridge.entity.Book;
import com.bookbridge.entity.BookType;
import com.bookbridge.entity.Category;
import com.bookbridge.entity.User;
import com.bookbridge.repository.BookRepository;
import com.bookbridge.repository.CategoryRepository;
import com.bookbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public List<BookDto> getAllBooks() {
        return bookRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<BookDto> getMyBooks(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        return bookRepository.findBySellerId(user.getId())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<BookDto> getBooksByType(BookType type) {
        return bookRepository.findByType(type).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public BookDto getBookById(Integer id) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));
        return mapToDto(book);
    }

    public BookDto createBook(BookRequest request, String userEmail) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        User seller = null;
        if (request.getType() == BookType.SECOND_HAND) {
            seller = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .isbn(request.getIsbn())
                .description(request.getDescription())
                .category(category)
                .type(request.getType())
                .condition(request.getCondition())
                .sellingPrice(request.getSellingPrice())
                .originalPrice(request.getOriginalPrice())
                .imageUrl(request.getImageUrl())
                .seller(seller)
                .build();

        Book savedBook = bookRepository.save(book);
        return mapToDto(savedBook);
    }

    private BookDto mapToDto(Book book) {
        return BookDto.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .description(book.getDescription())
                .categoryName(book.getCategory().getName())
                .type(book.getType())
                .condition(book.getCondition())
                .sellingPrice(book.getSellingPrice())
                .originalPrice(book.getOriginalPrice())
                .imageUrl(book.getImageUrl())
                .sellerName(book.getSeller() != null ? book.getSeller().getName() : "BookBridge Store")
                .sellerId(book.getSeller() != null ? book.getSeller().getId() : null)
                .build();
    }
}
