package com.roomih.orderapi.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.roomih.orderapi.model.Cart;
import com.roomih.orderapi.security.CustomUserDetails;
import com.roomih.orderapi.service.CartService;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "Получить корзину текущего пользователя")
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(cartService.getCartByUser(currentUser.getUser()));
    }

    @PostMapping("/clear")
    @Operation(summary = "Очистить корзину")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal CustomUserDetails currentUser) {
        cartService.clearCart(currentUser.getUser());
        return ResponseEntity.ok().build();
    }
} 