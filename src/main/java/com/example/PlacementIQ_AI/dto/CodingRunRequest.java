package com.example.PlacementIQ_AI.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CodingRunRequest {

    private Long questionId;
    private String language;
    private String code;
    private List<TestCase> testCases;

    @Getter
    @Setter
    public static class TestCase {
        private String input;
        private String expectedOutput;
    }
}