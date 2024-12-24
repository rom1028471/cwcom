package com.roomih.orderapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.roomih.orderapi.model.Publication;
import com.roomih.orderapi.model.Subscription;
import com.roomih.orderapi.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserOrderByStartDateDesc(User user);
    List<Subscription> findByUserAndActiveTrue(User user);
    Optional<Subscription> findByIdAndUser(Long id, User user);
    Optional<Subscription> findByUserAndPublicationAndActiveTrue(User user, Publication publication);
}
