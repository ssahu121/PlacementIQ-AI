package com.example.PlacementIQ_AI.controller;

import com.example.PlacementIQ_AI.entity.AptitudeResult;
import com.example.PlacementIQ_AI.entity.TechnicalResult;
import com.example.PlacementIQ_AI.entity.CodingResult;

import com.example.PlacementIQ_AI.repository.AptitudeResultRepository;
import com.example.PlacementIQ_AI.repository.TechnicalResultRepository;
import com.example.PlacementIQ_AI.repository.CodingResultRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final AptitudeResultRepository aptitudeResultRepository;
    private final TechnicalResultRepository technicalResultRepository;
    private final CodingResultRepository codingResultRepository;


    public DashboardController(
            AptitudeResultRepository aptitudeResultRepository,
            TechnicalResultRepository technicalResultRepository,
            CodingResultRepository codingResultRepository) {

        this.aptitudeResultRepository =
                aptitudeResultRepository;

        this.technicalResultRepository =
                technicalResultRepository;

        this.codingResultRepository =
                codingResultRepository;
    }


    // =====================================================
    // GET STUDENT DASHBOARD
    // =====================================================

    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getDashboard(
            @PathVariable Long userId) {


        Map<String, Object> dashboard =
                new HashMap<>();


        // =================================================
        // LATEST APTITUDE RESULT
        // =================================================

        AptitudeResult aptitude =
                aptitudeResultRepository
                        .findTopByUserIdOrderByIdDesc(userId)
                        .orElse(null);


        double aptitudePercentage =
                aptitude != null
                        ? aptitude.getPercentage()
                        : 0;


        boolean aptitudePassed =
                aptitude != null
                        && aptitude.isPassed();


        // =================================================
        // LATEST TECHNICAL RESULT
        // =================================================

        TechnicalResult technical =
                technicalResultRepository
                        .findTopByUserIdOrderByIdDesc(userId)
                        .orElse(null);


        double technicalPercentage =
                technical != null
                        ? technical.getPercentage()
                        : 0;


        boolean technicalPassed =
                technical != null
                        && technical.isPassed();


        // =================================================
        // LATEST CODING RESULT
        // =================================================

        CodingResult coding =
                codingResultRepository
                        .findTopByUserIdOrderByIdDesc(userId)
                        .orElse(null);


        double codingPercentage =
                coding != null
                        ? coding.getPercentage()
                        : 0;


        boolean codingPassed =
                coding != null
                        && coding.isPassed();


        // =================================================
        // ROUNDS CLEARED
        // =================================================

        int roundsCleared = 0;


        if (aptitudePassed) {
            roundsCleared++;
        }


        if (technicalPassed) {
            roundsCleared++;
        }


        if (codingPassed) {
            roundsCleared++;
        }


        // =================================================
        // ATTEMPTED ROUNDS
        // =================================================

        int attemptedRounds = 0;


        if (aptitude != null) {
            attemptedRounds++;
        }


        if (technical != null) {
            attemptedRounds++;
        }


        if (coding != null) {
            attemptedRounds++;
        }


        // =================================================
        // ACTUAL ATTEMPT COUNTS
        // =================================================

        long aptitudeAttempts =
                aptitudeResultRepository
                        .countByUserId(userId);


        long technicalAttempts =
                technicalResultRepository
                        .countByUserId(userId);


        long codingAttempts =
                codingResultRepository
                        .countByUserId(userId);


        long totalMockTests =
                aptitudeAttempts
                        + technicalAttempts
                        + codingAttempts;


        // =================================================
        // OVERALL SCORE
        // =================================================

        double overallPercentage = 0;


        if (attemptedRounds > 0) {

            overallPercentage =
                    (
                            aptitudePercentage
                                    + technicalPercentage
                                    + codingPercentage
                    )
                            / attemptedRounds;
        }


        // =================================================
        // ROUND DETAILS
        // =================================================

        dashboard.put(
                "userId",
                userId
        );


        dashboard.put(
                "aptitude",
                aptitudePercentage
        );


        dashboard.put(
                "technical",
                technicalPercentage
        );


        dashboard.put(
                "coding",
                codingPercentage
        );


        // =================================================
        // PASS STATUS
        // =================================================

        dashboard.put(
                "aptitudePassed",
                aptitudePassed
        );


        dashboard.put(
                "technicalPassed",
                technicalPassed
        );


        dashboard.put(
                "codingPassed",
                codingPassed
        );


        // =================================================
        // ROUND INFORMATION
        // =================================================

        dashboard.put(
                "roundsCleared",
                roundsCleared
        );


        dashboard.put(
                "totalRounds",
                3
        );


        dashboard.put(
                "attemptedRounds",
                attemptedRounds
        );


        // =================================================
        // ACTUAL MOCK TEST COUNT
        // =================================================

        dashboard.put(
                "aptitudeAttempts",
                aptitudeAttempts
        );


        dashboard.put(
                "technicalAttempts",
                technicalAttempts
        );


        dashboard.put(
                "codingAttempts",
                codingAttempts
        );


        dashboard.put(
                "mockTestsGiven",
                totalMockTests
        );


        // =================================================
        // OVERALL
        // =================================================

        dashboard.put(
                "overall",
                Math.round(
                        overallPercentage * 100.0
                ) / 100.0
        );


        // =================================================
        // RESPONSE
        // =================================================

        return ResponseEntity.ok(
                dashboard
        );
    }
}