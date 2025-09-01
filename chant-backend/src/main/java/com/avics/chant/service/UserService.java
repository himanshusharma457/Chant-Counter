package com.avics.chant.service;

import com.avics.chant.dto.ApiResponse;
import com.avics.chant.dto.CreateUserRequest;
import com.avics.chant.entity.User;

import java.util.Optional;

public interface UserService {
    ApiResponse createUser(CreateUserRequest request);
    Optional<User> findUser(String identifier);
}
