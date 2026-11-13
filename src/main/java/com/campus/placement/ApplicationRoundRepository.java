package com.campus.placement;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRoundRepository extends JpaRepository<ApplicationRound, Long> {
    List<ApplicationRound> findByApplicationIdOrderBySequenceAsc(Long applicationId);
}
