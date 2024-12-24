package com.roomih.orderapi.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.roomih.orderapi.dto.SubscriptionRequest;
import com.roomih.orderapi.exception.ResourceNotFoundException;
import com.roomih.orderapi.exception.SubscriptionException;
import com.roomih.orderapi.model.*;
import com.roomih.orderapi.repository.*;
import com.roomih.orderapi.service.CartService;
import com.roomih.orderapi.service.SubscriptionService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final PublicationRepository publicationRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;

    @Override
    @Transactional
    public Subscription createSubscription(User user, SubscriptionRequest request) {
        Publication publication = publicationRepository.findById(request.getPublicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Публикация не найдена"));

        // Проверяем, нет ли уже активной подписки на эту публикацию
        Optional<Subscription> existingSubscription = subscriptionRepository
                .findByUserAndPublicationAndActiveTrue(user, publication);
        
        if (existingSubscription.isPresent()) {
            throw new SubscriptionException("У вас уже есть активная подписка на эту публикацию");
        }

        // Проверяем корректность периода подписки
        if (request.getSubscriptionPeriod() < 1 || request.getSubscriptionPeriod() > 12) {
            throw new SubscriptionException("Период подписки должен быть от 1 до 12 месяцев");
        }

        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = startDate.plusMonths(request.getSubscriptionPeriod());

        // Проверяем корректность дат
        if (endDate.isBefore(startDate)) {
            throw new SubscriptionException("Дата окончания подписки не может быть раньше даты начала");
        }

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setPublication(publication);
        subscription.setStartDate(startDate);
        subscription.setEndDate(endDate);
        subscription.setSubscriptionPeriod(request.getSubscriptionPeriod());
        subscription.setTotalPrice(request.getTotalPrice());
        subscription.setActive(true);

        return subscriptionRepository.save(subscription);
    }

    @Override
    @Transactional
    public List<Subscription> createSubscriptionsFromCartRequests(User user, List<SubscriptionRequest> requests) {
        List<Subscription> subscriptions = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        
        for (SubscriptionRequest request : requests) {
            try {
                // Проверяем существование публикации
                Publication publication = publicationRepository.findById(request.getPublicationId())
                        .orElseThrow(() -> new ResourceNotFoundException("Пуб��икация не найдена"));

                // Проверяем наличие активной подписки
                Optional<Subscription> existingSubscription = subscriptionRepository
                        .findByUserAndPublicationAndActiveTrue(user, publication);
                
                if (existingSubscription.isPresent()) {
                    errors.add(String.format(
                        "Публикация '%s': У вас уже есть активная подписка до %s", 
                        publication.getTitle(),
                        existingSubscription.get().getEndDate().format(java.time.format.DateTimeFormatter.ofPattern("dd.MM.yyyy"))
                    ));
                    continue;
                }

                // Создаем новую подписку
                Subscription subscription = new Subscription();
                subscription.setUser(user);
                subscription.setPublication(publication);
                subscription.setStartDate(LocalDateTime.now());
                subscription.setEndDate(LocalDateTime.now().plusMonths(request.getSubscriptionPeriod()));
                subscription.setSubscriptionPeriod(request.getSubscriptionPeriod());
                subscription.setTotalPrice(request.getTotalPrice());
                subscription.setActive(true);

                subscriptions.add(subscriptionRepository.save(subscription));
            } catch (Exception e) {
                Publication publication = publicationRepository.findById(request.getPublicationId())
                        .orElseThrow(() -> new ResourceNotFoundException("Публикация не найдена"));
                errors.add("Публикация '" + publication.getTitle() + "': " + e.getMessage());
            }
        }

        // Если были ошибки
        if (!errors.isEmpty()) {
            // Если есть успешно созданные подписки, очищаем только соответствующие элементы корзины
            if (!subscriptions.isEmpty()) {
                Set<Long> successfulPublicationIds = subscriptions.stream()
                        .map(s -> s.getPublication().getId())
                        .collect(Collectors.toSet());
                
                Cart cart = cartRepository.findByUser(user)
                        .orElseThrow(() -> new ResourceNotFoundException("Корзина не найдена"));
                
                // Удаляем только успешно оформленные подписки из корзины
                cart.getItems().removeIf(item -> successfulPublicationIds.contains(item.getPublication().getId()));
                cartRepository.save(cart);
                
                throw new SubscriptionException("Некоторые подписки не были оформлены: " + String.join("; ", errors));
            } else {
                throw new SubscriptionException("Не удалось оформить подписки: " + String.join("; ", errors));
            }
        }

        // Если все успешно, очищаем всю корзину
        cartService.clearCart(user);

        return subscriptions;
    }

    @Override
    public List<Subscription> getUserSubscriptions(User user) {
        return subscriptionRepository.findByUserOrderByStartDateDesc(user);
    }

    @Override
    public List<Subscription> getActiveSubscriptions(User user) {
        return subscriptionRepository.findByUserAndActiveTrue(user);
    }

    @Override
    @Transactional
    public void cancelSubscription(User user, Long subscriptionId) {
        Subscription subscription = subscriptionRepository.findByIdAndUser(subscriptionId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Подписка не найдена"));

        if (!subscription.isActive()) {
            throw new SubscriptionException("Подписка уже отменена или завершена");
        }

        subscription.setActive(false);
        subscriptionRepository.save(subscription);
    }

    @Override
    @Transactional
    public Subscription updateSubscriptionPeriod(User user, Long subscriptionId, Integer newPeriod) {
        Subscription subscription = subscriptionRepository.findByIdAndUser(subscriptionId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Подписка не найдена"));

        if (!subscription.isActive()) {
            throw new SubscriptionException("Нельзя изменить период неактивной подписки");
        }

        if (newPeriod < 1 || newPeriod > 12) {
            throw new SubscriptionException("Период подписки должен быть от 1 до 12 месяцев");
        }

        // Получаем цену за месяц из публикации
        double pricePerMonth = subscription.getPublication().getPricePerMonth();
        double newTotalPrice = pricePerMonth * newPeriod;

        // Обновляем данные подписки
        subscription.setSubscriptionPeriod(newPeriod);
        subscription.setEndDate(subscription.getStartDate().plusMonths(newPeriod));
        subscription.setTotalPrice(newTotalPrice);

        // Сохраняем и инициализируем связанные сущности
        Subscription savedSubscription = subscriptionRepository.save(subscription);
        savedSubscription.getPublication().getTitle(); // Инициализируем публикацию
        savedSubscription.getUser().getEmail(); // Инициализируем пользователя

        return savedSubscription;
    }

    @Override
    @Transactional(readOnly = true)
    public Subscription findActiveSubscriptionForPublication(User user, Long publicationId) {
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Публикация не найдена"));
        
        Optional<Subscription> subscription = subscriptionRepository
                .findByUserAndPublicationAndActiveTrue(user, publication);
        
        return subscription.orElse(null);
    }
} 