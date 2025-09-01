package com.avics.chant.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class UserRequest {

    @NotBlank(message = "User ID cannot be empty")
    @Size(min = 8, message = "User ID must be at least 8 characters long")
    private String userId;

    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
}
