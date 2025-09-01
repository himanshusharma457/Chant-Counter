package com.avics.chant.dto;

public class ChantResponse {

    private String userId;
    private long totalUserChants;
    private long globalChants;

    public ChantResponse() {}

    public ChantResponse(String userId, long totalUserChants, long globalChants) {
        this.userId = userId;
        this.totalUserChants = totalUserChants;
        this.globalChants = globalChants;
    }

    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public long getTotalUserChants() {
        return totalUserChants;
    }
    public void setTotalUserChants(long totalUserChants) {
        this.totalUserChants = totalUserChants;
    }

    public long getGlobalChants() {
        return globalChants;
    }
    public void setGlobalChants(long globalChants) {
        this.globalChants = globalChants;
    }
}
