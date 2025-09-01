package com.avics.chant.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ValidationUtil {

    @Value("${chant.user.min.length}")
    private int minUserLength;

    @Value("${chant.phone.pattern}")
    private String phonePattern;

    public boolean isPhoneNumber(String input) {
        return input != null && input.matches(phonePattern);
    }

    public boolean isValidUserId(String input) {
        return input != null && input.length() >= minUserLength;
    }

    public String normalizeUserId(String input) {
        return input != null ? input.toUpperCase() : null;
    }
}
