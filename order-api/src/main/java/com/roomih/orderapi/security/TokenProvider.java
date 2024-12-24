package com.roomih.orderapi.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Optional;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

@Slf4j
@Component
public class TokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    private static final long JWT_EXPIRATION = 86400000; // 24 часа в миллисекундах

    public String generate(Authentication authentication) {
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

        byte[] keyBytes = jwtSecret.getBytes();
        SecretKey key = new SecretKeySpec(keyBytes, "HmacSHA256");

        return Jwts.builder()
                .claim("sub", user.getUsername())
                .claim("iat", now)
                .claim("exp", expiryDate)
                .signWith(key)
                .compact();
    }

    public Optional<Jws<Claims>> validateTokenAndGetJws(String token) {
        try {
            byte[] keyBytes = jwtSecret.getBytes();
            SecretKey key = new SecretKeySpec(keyBytes, "HmacSHA256");

            Jws<Claims> jws = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);

            return Optional.of(jws);
        } catch (SignatureException ex) {
            log.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty");
        }
        return Optional.empty();
    }
}
