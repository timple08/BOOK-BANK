package com.bookbridge.repository;

import com.bookbridge.entity.ExchangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Integer> {
    List<ExchangeRequest> findByTargetUserId(Integer targetUserId);
    List<ExchangeRequest> findByProposerId(Integer proposerId);
}
