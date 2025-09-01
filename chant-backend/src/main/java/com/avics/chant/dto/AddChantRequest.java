
package com.avics.chant.dto;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddChantRequest {
	
	@NotBlank(message = "User ID or Phone number is required")
    private String userid;
	
    private LocalDate date;
    
    @Min(value = 1, message = "Count must be at least 1")
    private Integer count;

    
}

