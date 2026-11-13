package com.campus.placement;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByUserId(Long userId);

    boolean existsByUserIdAndJobId(Long userId, Long jobId);
}
