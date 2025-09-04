package com.avics.chant.controller;

import com.avics.chant.dto.ApiResponse;
import com.avics.chant.dto.CreateUserRequest;
import com.avics.chant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createUser(@RequestBody CreateUserRequest request){
        return ResponseEntity.ok(userService.createUser(request));
    }

    @GetMapping("/exists/{userId}")
    public ResponseEntity<Boolean> isUserExists(@PathVariable String userId){
        return ResponseEntity.ok(userService.isUserExists(userId));
    }
}
