package com.Hoang105.tickets.utils;

import java.util.UUID;

import org.springframework.security.oauth2.jwt.Jwt;

public final class JwtUtil {
    private JwtUtil() {
        // Private constructor to prevent instantiation
    }

    
    public static UUID parseUserId(Jwt jwt){
        return UUID.fromString(jwt.getSubject());
    }
}
