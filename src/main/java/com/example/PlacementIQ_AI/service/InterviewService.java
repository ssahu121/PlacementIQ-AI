package com.example.PlacementIQ_AI.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class InterviewService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateQuestion(String stack, int questionNumber) {

        String prompt = """
                You are a professional technical interviewer
                conducting a placement interview.

                Student technology stack: %s

                This is question number: %d out of 5.

                Generate ONE interview question suitable for
                a college student preparing for placement.

                Rules:
                - Question must be related to the student's stack.
                - Do not give the answer.
                - Do not generate multiple questions.
                - Difficulty should gradually increase.
                - Make the question suitable for a spoken interview.
                - Return ONLY the question text.
                """.formatted(stack, questionNumber);

        String url =
                "https://generativelanguage.googleapis.com/v1beta/interactions";

        Map<String, Object> requestBody = Map.of(
                "model", "gemini-3.6-flash",
                "input", prompt
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", apiKey);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        url,
                        request,
                        Map.class
                );

        Map body = response.getBody();

        if (body == null) {
            throw new RuntimeException("Empty response from Gemini");
        }

        Object outputText = body.get("output_text");

        if (outputText != null) {
            return outputText.toString().trim();
        }

        var steps = (java.util.List<Map>) body.get("steps");

        if (steps == null || steps.isEmpty()) {
            throw new RuntimeException("No answer received from Gemini");
        }

        for (Map step : steps) {

            if (!"model_output".equals(step.get("type"))) {
                continue;
            }

            var content = (java.util.List<Map>) step.get("content");

            if (content == null) {
                continue;
            }

            for (Map item : content) {

                if ("text".equals(item.get("type"))) {
                    Object text = item.get("text");

                    if (text != null) {
                        return text.toString().trim();
                    }
                }
            }
        }

        throw new RuntimeException("No text received from Gemini");
    }
}