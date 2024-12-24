package com.roomih.orderapi.service;

import java.util.List;

import com.roomih.orderapi.dto.SubscriptionRequest;
import com.roomih.orderapi.model.Subscription;
import com.roomih.orderapi.model.User;

public interface SubscriptionService {
    Subscription createSubscription(User user, SubscriptionRequest request);
    List<Subscription> getUserSubscriptions(User user);
    List<Subscription> getActiveSubscriptions(User user);
    void cancelSubscription(User user, Long subscriptionId);
    List<Subscription> createSubscriptionsFromCartRequests(User user, List<SubscriptionRequest> requests);
    Subscription updateSubscriptionPeriod(User user, Long subscriptionId, Integer newPeriod);
    Subscription findActiveSubscriptionForPublication(User user, Long publicationId);
}
