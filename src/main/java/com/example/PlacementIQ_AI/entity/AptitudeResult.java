package com.example.PlacementIQ_AI.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "aptitude_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AptitudeResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private int score;

    private int totalQuestions;

    private double percentage;

    private boolean passed;
}