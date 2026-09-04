package com.example.PlacementIQ_AI.controller;

import com.example.PlacementIQ_AI.entity.TechnicalResult;
import com.example.PlacementIQ_AI.repository.TechnicalResultRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/technical")
@CrossOrigin(origins = "http://localhost:5173")
public class TechnicalController {

    private final TechnicalResultRepository technicalResultRepository;

    public TechnicalController(
            TechnicalResultRepository technicalResultRepository) {
        this.technicalResultRepository = technicalResultRepository;
    }

    @PostMapping("/submit")
    public ResponseEntity<TechnicalResult> submitResult(
            @RequestBody TechnicalResult result) {

        TechnicalResult savedResult =
                technicalResultRepository.save(result);

        return ResponseEntity.ok(savedResult);
    }

    @GetMapping("/result/{userId}")
    public ResponseEntity<TechnicalResult> getLatestResult(
            @PathVariable Long userId) {

        return technicalResultRepository
                .findTopByUserIdOrderByIdDesc(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}