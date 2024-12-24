package com.roomih.orderapi.mapper;

import com.roomih.orderapi.dto.UserDto;
import com.roomih.orderapi.model.User;

public interface UserMapper {

    UserDto toUserDto(User user);
}