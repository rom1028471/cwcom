package com.roomih.orderapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column
    private String role = "ROLE_USER";

    private String address;
    private String city;
    
    @Column(name = "postal_code")
    private String postalCode;

    @JsonIgnoreProperties("user")
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<Subscription> subscriptions = new HashSet<>();

    @JsonIgnoreProperties("user")
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Cart cart;

    public User(String email, String firstName, String lastName, String password, String phoneNumber) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.role = "ROLE_USER";
        this.createdAt = LocalDateTime.now();
    }

    public User(String email, String firstName, String lastName, String password, String phoneNumber, 
                String address, String city, String postalCode) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.role = "ROLE_USER";
        this.address = address;
        this.city = city;
        this.postalCode = postalCode;
        this.createdAt = LocalDateTime.now();
    }

    // Методы для совместимости со Spring Security
    public String getUsername() {
        return email;
    }

    public String getName() {
        if (firstName == null && lastName == null) return "";
        if (firstName == null) return lastName;
        if (lastName == null) return firstName;
        return firstName + " " + lastName;
    }

    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            this.firstName = null;
            this.lastName = null;
            return;
        }

        String[] parts = name.trim().split("\\s+", 2);
        this.firstName = parts[0];
        this.lastName = parts.length > 1 ? parts[1] : null;
    }

    public Set<String> getRoles() {
        return Set.of(role);
    }
}
