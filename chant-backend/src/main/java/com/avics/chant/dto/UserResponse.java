package com.avics.chant.dto;

public class UserResponse {

    private String userId;
    private String message;

    public UserResponse() {}

    public UserResponse(String userId, String message) {
        this.userId = userId;
        this.message = message;
    }

    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
}
