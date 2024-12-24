package com.roomih.orderapi.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "publication_id")
    private Publication publication;

    @Column(name = "subscription_period")
    private Integer subscriptionPeriod;

    @Column(name = "total_price")
    private Float totalPrice;
} 