package com.example.PlacementIQ_AI.controller;

import com.example.PlacementIQ_AI.entity.AptitudeResult;
import com.example.PlacementIQ_AI.repository.AptitudeResultRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/aptitude")
@CrossOrigin(origins = "http://localhost:5173")
public class AptitudeController {

    private final AptitudeResultRepository aptitudeResultRepository;

    public AptitudeController(
            AptitudeResultRepository aptitudeResultRepository) {
        this.aptitudeResultRepository = aptitudeResultRepository;
    }

    @PostMapping("/submit")
    public ResponseEntity<AptitudeResult> submitResult(
            @RequestBody AptitudeResult result) {

        AptitudeResult savedResult =
                aptitudeResultRepository.save(result);

        return ResponseEntity.ok(savedResult);
    }

    @GetMapping("/result/{userId}")
    public ResponseEntity<AptitudeResult> getLatestResult(
            @PathVariable Long userId) {

        return aptitudeResultRepository
                .findTopByUserIdOrderByIdDesc(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}