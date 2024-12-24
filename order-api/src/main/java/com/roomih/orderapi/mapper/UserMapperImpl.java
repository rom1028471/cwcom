package com.roomih.orderapi.mapper;

import org.springframework.stereotype.Service;

import com.roomih.orderapi.dto.UserDto;
import com.roomih.orderapi.model.User;

import java.util.Collections;

@Service
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDto toUserDto(User user) {
        if (user == null) {
            return null;
        }
        return new UserDto(
            user.getId(), 
            user.getEmail(), 
            user.getName(), 
            user.getRole(), 
            user.getAddress(),
            user.getCity(),
            user.getPostalCode(),
            user.getPhoneNumber(),
            Collections.emptyList()
        );
    }
}
