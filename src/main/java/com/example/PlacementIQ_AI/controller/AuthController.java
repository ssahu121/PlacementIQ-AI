package com.example.PlacementIQ_AI.controller;

import com.example.PlacementIQ_AI.dto.LoginRequest;
import com.example.PlacementIQ_AI.dto.RegisterRequest;
import com.example.PlacementIQ_AI.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }
    @GetMapping("/test")
    public String test() {
        return "Auth Controller Working";
    }
    @PostMapping("/login")
    public String login(
            @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }
}