package com.example.PlacementIQ_AI.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "technical_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TechnicalResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String stack;

    private int score;

    private int totalQuestions;

    private double percentage;

    private boolean passed;
}