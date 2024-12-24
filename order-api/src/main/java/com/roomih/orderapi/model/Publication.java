package com.roomih.orderapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@Entity
@Table(name = "publications")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Publication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "price_per_month", nullable = false)
    private Double pricePerMonth;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PublicationType type = PublicationType.MAGAZINE;

    @Column(columnDefinition = "TEXT")
    private String content;

    @JsonIgnore
    @OneToMany(mappedBy = "publication", fetch = FetchType.LAZY)
    private Set<Subscription> subscriptions = new HashSet<>();
}
