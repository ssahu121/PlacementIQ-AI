package com.example.PlacementIQ_AI.repository;

import com.example.PlacementIQ_AI.entity.CodingResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CodingResultRepository
        extends JpaRepository<CodingResult, Long> {

    Optional<CodingResult> findTopByUserIdOrderByIdDesc(Long userId);
}