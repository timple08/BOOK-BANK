package com.bookbridge.config;

import com.bookbridge.entity.Book;
import com.bookbridge.entity.BookCondition;
import com.bookbridge.entity.BookType;
import com.bookbridge.entity.Category;
import com.bookbridge.repository.BookRepository;
import com.bookbridge.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(CategoryRepository categoryRepository, BookRepository bookRepository) {
        return args -> {
            if (categoryRepository.count() == 0) {
                Category fiction = Category.builder().name("Fiction").description("Fictional books").build();
                Category nonFiction = Category.builder().name("Non-Fiction").description("Non-fictional books").build();
                Category science = Category.builder().name("Science").description("Science and Technology").build();
                
                categoryRepository.saveAll(List.of(fiction, nonFiction, science));
                
                if (bookRepository.count() == 0) {
                    bookRepository.saveAll(List.of(
                        Book.builder()
                            .title("The Great Gatsby")
                            .author("F. Scott Fitzgerald")
                            .category(fiction)
                            .type(BookType.NEW)
                            .sellingPrice(new BigDecimal("15.99"))
                            .description("A classic novel set in the Roaring Twenties.")
                            .build(),
                        Book.builder()
                            .title("A Brief History of Time")
                            .author("Stephen Hawking")
                            .category(science)
                            .type(BookType.SECOND_HAND)
                            .condition(BookCondition.GOOD)
                            .sellingPrice(new BigDecimal("9.99"))
                            .originalPrice(new BigDecimal("20.00"))
                            .description("A landmark volume in science writing.")
                            .build()
                    ));
                }
            }
        };
    }
}
