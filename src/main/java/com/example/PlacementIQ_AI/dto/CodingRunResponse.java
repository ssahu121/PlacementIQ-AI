package com.example.PlacementIQ_AI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class CodingRunResponse {

    private boolean success;
    private boolean allPassed;
    private String message;
    private List<TestCaseResult> testCases;

    @Getter
    @AllArgsConstructor
    public static class TestCaseResult {

        private int testCaseNumber;
        private boolean passed;
        private String input;
        private String expectedOutput;
        private String actualOutput;
    }
}