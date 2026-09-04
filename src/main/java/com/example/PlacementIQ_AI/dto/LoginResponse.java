package com.example.PlacementIQ_AI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private Long id;
    private String fullName;
    private String email;
    private String role;
}