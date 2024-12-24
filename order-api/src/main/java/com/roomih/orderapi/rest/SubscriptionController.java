package com.roomih.orderapi.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.roomih.orderapi.dto.SubscriptionRequest;
import com.roomih.orderapi.dto.UpdatePeriodRequest;
import com.roomih.orderapi.model.Subscription;
import com.roomih.orderapi.model.User;
import com.roomih.orderapi.security.CustomUserDetails;
import com.roomih.orderapi.service.SubscriptionService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping("/my")
    @Operation(summary = "Получить подписку текущего пользователя")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Subscription>> getUserSubscriptions(@AuthenticationPrincipal CustomUserDetails currentUser) {
        List<Subscription> subscriptions = subscriptionService.getUserSubscriptions(currentUser.getUser());
        // Инициализируем связанные сущности
        subscriptions.forEach(subscription -> {
            subscription.getPublication().getTitle();
            subscription.getUser().getEmail();
        });
        return ResponseEntity.ok(subscriptions);
    }

    @PostMapping
    @Operation(summary = "Создать новую подписку")
    @Transactional
    public ResponseEntity<Subscription> createSubscription(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody SubscriptionRequest request) {
        User user = currentUser.getUser();
        Subscription subscription = subscriptionService.createSubscription(user, request);
        return ResponseEntity.ok(subscription);
    }

    @PostMapping("/create-from-cart")
    @Operation(summary = "Создать подписки из корзины")
    @Transactional
    public ResponseEntity<List<Subscription>> createSubscriptionsFromCart(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @RequestBody CreateSubscriptionsRequest request) {
        User user = currentUser.getUser();
        List<Subscription> subscriptions = subscriptionService.createSubscriptionsFromCartRequests(user, request.getSubscriptions());
        return ResponseEntity.ok(subscriptions);
    }

    @PutMapping("/{id}/period")
    @Operation(summary = "Изменить период подписки")
    @Transactional
    public ResponseEntity<Subscription> updateSubscriptionPeriod(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id,
            @Valid @RequestBody UpdatePeriodRequest request) {
        User user = currentUser.getUser();
        Subscription subscription = subscriptionService.updateSubscriptionPeriod(user, id, request.getSubscriptionPeriod());
        // Инициализируем связанные сущности перед отправкой
        subscription.getPublication().getTitle();
        subscription.getUser().getEmail();
        return ResponseEntity.ok(subscription);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Отменить подписку")
    @Transactional
    public ResponseEntity<Void> cancelSubscription(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id) {
        subscriptionService.cancelSubscription(currentUser.getUser(), id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check/{publicationId}")
    @Operation(summary = "Проверить наличие активной подписки на публикацию")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> checkActiveSubscription(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long publicationId) {
        Subscription activeSubscription = subscriptionService.findActiveSubscriptionForPublication(
            currentUser.getUser(), 
            publicationId
        );
        
        if (activeSubscription != null) {
            return ResponseEntity.ok(Map.of(
                "hasActiveSubscription", true,
                "endDate", activeSubscription.getEndDate()
            ));
        }
        
        return ResponseEntity.ok(Map.of(
            "hasActiveSubscription", false
        ));
    }
}

class CreateSubscriptionsRequest {
    private List<SubscriptionRequest> subscriptions;

    public List<SubscriptionRequest> getSubscriptions() {
        return subscriptions;
    }

    public void setSubscriptions(List<SubscriptionRequest> subscriptions) {
        this.subscriptions = subscriptions;
    }
}
