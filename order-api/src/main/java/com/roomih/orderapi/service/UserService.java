package com.roomih.orderapi.service;

import java.util.List;

import com.roomih.orderapi.model.User;

public interface UserService {
    List<User> getUsers();
    
    User validateAndGetUserByEmail(String email);
    
    boolean hasUserWithEmail(String email);
    
    User saveUser(User user);
    
    void deleteUser(User user);
    
    boolean checkPassword(User user, String password);
    
    void changeUserPassword(User user, String newPassword);
    
    User updateUserProfile(User user, String name, String address, String city, 
                         String postalCode, String phoneNumber);
    
    User createUser(String email, String password, String name);
}
