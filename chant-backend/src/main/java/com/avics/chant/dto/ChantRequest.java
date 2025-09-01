package com.avics.chant.dto;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.PastOrPresent;

import lombok.Data;

import java.time.LocalDate;
@Data
public class ChantRequest {

    @NotBlank(message = "User ID or Phone number is required")
    private String userId;

    @PastOrPresent(message = "Date cannot be in the future")
    private LocalDate date;  // optional, defaults to today

    @Min(value = 1, message = "Count must be at least 1")
    private int count;

 
    
}
