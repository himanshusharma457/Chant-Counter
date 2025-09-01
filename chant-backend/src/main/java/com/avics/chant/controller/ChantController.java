package com.avics.chant.controller;

import com.avics.chant.dto.*;
import com.avics.chant.service.ChantService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chants")
public class ChantController {

    @Autowired
    private ChantService chantService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addChant(@RequestBody AddChantRequest request){
        return ResponseEntity.ok(chantService.addChant(request));
    }

    @GetMapping("/user/{userId}/total")
    public ResponseEntity<UserTotalResponse> getUserTotal(@PathVariable String userId){
        return ResponseEntity.ok(chantService.getUserTotal(userId));
    }

    @GetMapping("/total")
    public ResponseEntity<TotalChantsResponse> getTotalChants(){
        return ResponseEntity.ok(chantService.getTotalChants());
    }
    
    @GetMapping("/usersCounts")
    public ResponseEntity<List<UserChantResponse>> getAllUserChantCounts() {
        return ResponseEntity.ok(chantService.getAllUserChantCounts());
    }
}
