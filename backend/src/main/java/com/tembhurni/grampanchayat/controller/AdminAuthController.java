package com.tembhurni.grampanchayat.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {

    @Value("${app.admin.password}")
    private String adminPassword;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> req) {

        String password = req.get("password");

        if (adminPassword.equals(password)) {
            return ResponseEntity.ok("SUCCESS");
        }

        return ResponseEntity.status(401).body("INVALID PASSWORD");
    }
}


