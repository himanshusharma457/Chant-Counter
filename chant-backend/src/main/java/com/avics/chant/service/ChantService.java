package com.avics.chant.service;

import java.util.List;

import com.avics.chant.dto.*;

public interface ChantService {
	
    ApiResponse addChant(AddChantRequest request);
    
    UserTotalResponse getUserTotal(String userId);
    
    TotalChantsResponse getTotalChants();
    
    List<UserChantResponse> getAllUserChantCounts();
}
