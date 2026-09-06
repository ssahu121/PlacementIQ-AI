package com.example.PlacementIQ_AI.controller;

import com.example.PlacementIQ_AI.service.InterviewService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "http://localhost:5173")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping("/question")
    public ResponseEntity<?> generateQuestion(
            @RequestBody QuestionRequest request) {

        try {

            String question = interviewService.generateQuestion(
                    request.getStack(),
                    request.getQuestionNumber()
            );

            return ResponseEntity.ok(
                    new QuestionResponse(question)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(
                            "ERROR: "
                                    + e.getClass().getName()
                                    + " - "
                                    + e.getMessage()
                    );
        }
    }

    @Data
    public static class QuestionRequest {

        private String stack;

        private int questionNumber;
    }

    @Data
    @AllArgsConstructor
    public static class QuestionResponse {

        private String question;
    }
}