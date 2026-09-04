package com.example.PlacementIQ_AI.repository;

import com.example.PlacementIQ_AI.entity.TechnicalResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TechnicalResultRepository
        extends JpaRepository<TechnicalResult, Long> {

    Optional<TechnicalResult> findTopByUserIdOrderByIdDesc(Long userId);
}