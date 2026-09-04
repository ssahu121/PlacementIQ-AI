package com.example.PlacementIQ_AI.controller;

import com.example.PlacementIQ_AI.entity.CodingResult;
import com.example.PlacementIQ_AI.repository.CodingResultRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coding")
@CrossOrigin(origins = "http://localhost:5173")
public class CodingController {

    private final CodingResultRepository codingResultRepository;

    public CodingController(
            CodingResultRepository codingResultRepository) {
        this.codingResultRepository = codingResultRepository;
    }

    @PostMapping("/submit")
    public ResponseEntity<CodingResult> submitResult(
            @RequestBody CodingResult result) {

        CodingResult savedResult =
                codingResultRepository.save(result);

        return ResponseEntity.ok(savedResult);
    }

    @GetMapping("/result/{userId}")
    public ResponseEntity<CodingResult> getLatestResult(
            @PathVariable Long userId) {

        return codingResultRepository
                .findTopByUserIdOrderByIdDesc(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}