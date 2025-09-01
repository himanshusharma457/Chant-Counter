package com.avics.chant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserTotalResponse {
	
    private String userid;
    private Long totalCount;

  
}
