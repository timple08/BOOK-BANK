package com.bookbridge.repository;

import com.bookbridge.entity.Book;
import com.bookbridge.entity.BookType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Integer> {
    List<Book> findByType(BookType type);
    List<Book> findByCategoryId(Integer categoryId);
    List<Book> findBySellerId(Integer sellerId);
}
