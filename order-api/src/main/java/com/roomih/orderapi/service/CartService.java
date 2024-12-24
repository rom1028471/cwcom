package com.roomih.orderapi.service;

import com.roomih.orderapi.model.Cart;
import com.roomih.orderapi.model.User;

public interface CartService {
    Cart getCartByUser(User user);
    void clearCart(User user);
} 