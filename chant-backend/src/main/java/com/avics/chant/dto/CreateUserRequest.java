
package com.avics.chant.dto;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CreateUserRequest {

  @NotBlank(message = "User ID cannot be empty")
  @Size(min = 8, message = "User ID must be at least 8 characters long")
	
  private String userid;
  

  
}
