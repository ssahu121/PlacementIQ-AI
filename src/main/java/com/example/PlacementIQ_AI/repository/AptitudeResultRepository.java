package com.example.PlacementIQ_AI.repository;

import com.example.PlacementIQ_AI.entity.AptitudeResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AptitudeResultRepository
        extends JpaRepository<AptitudeResult, Long> {

    Optional<AptitudeResult> findTopByUserIdOrderByIdDesc(Long userId);
}