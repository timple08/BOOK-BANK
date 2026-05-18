package com.bookbridge.service;

import com.bookbridge.dto.ExchangeDto;
import com.bookbridge.dto.ExchangeRequestPayload;
import com.bookbridge.entity.Book;
import com.bookbridge.entity.ExchangeRequest;
import com.bookbridge.entity.ExchangeStatus;
import com.bookbridge.entity.User;
import com.bookbridge.repository.BookRepository;
import com.bookbridge.repository.ExchangeRequestRepository;
import com.bookbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExchangeService {

    private final ExchangeRequestRepository exchangeRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public ExchangeDto createExchangeRequest(ExchangeRequestPayload payload, String proposerEmail) {
        User proposer = userRepository.findByEmail(proposerEmail).orElseThrow();
        User targetUser = userRepository.findById(payload.getTargetUserId()).orElseThrow();
        Book offeredBook = bookRepository.findById(payload.getOfferedBookId()).orElseThrow();
        Book requestedBook = bookRepository.findById(payload.getRequestedBookId()).orElseThrow();

        ExchangeRequest request = ExchangeRequest.builder()
                .proposer(proposer)
                .targetUser(targetUser)
                .offeredBook(offeredBook)
                .requestedBook(requestedBook)
                .status(ExchangeStatus.PENDING)
                .build();

        return mapToDto(exchangeRepository.save(request));
    }

    public List<ExchangeDto> getIncomingRequests(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        return exchangeRepository.findByTargetUserId(user.getId())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<ExchangeDto> getOutgoingRequests(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        return exchangeRepository.findByProposerId(user.getId())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ExchangeDto respondToRequest(Integer requestId, ExchangeStatus newStatus, String targetUserEmail) {
        ExchangeRequest request = exchangeRepository.findById(requestId).orElseThrow();
        User targetUser = userRepository.findByEmail(targetUserEmail).orElseThrow();
        
        if (!request.getTargetUser().getId().equals(targetUser.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        request.setStatus(newStatus);
        return mapToDto(exchangeRepository.save(request));
    }

    private ExchangeDto mapToDto(ExchangeRequest req) {
        return ExchangeDto.builder()
                .id(req.getId())
                .proposerId(req.getProposer().getId())
                .proposerName(req.getProposer().getName())
                .targetUserId(req.getTargetUser().getId())
                .targetUserName(req.getTargetUser().getName())
                .offeredBookId(req.getOfferedBook().getId())
                .offeredBookTitle(req.getOfferedBook().getTitle())
                .requestedBookId(req.getRequestedBook().getId())
                .requestedBookTitle(req.getRequestedBook().getTitle())
                .status(req.getStatus())
                .createdAt(req.getCreatedAt())
                .build();
    }
}
