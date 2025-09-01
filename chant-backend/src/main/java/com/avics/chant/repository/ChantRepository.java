package com.avics.chant.repository;

import com.avics.chant.dto.UserChantResponse;
import com.avics.chant.entity.Chant;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChantRepository extends JpaRepository<Chant, Long> {

    @Query("SELECT SUM(c.chantCount) FROM Chant c WHERE c.userIdentifier = :userId")
    Long getUserTotal(@Param("userId") String userId);

    @Query("SELECT SUM(c.chantCount) FROM Chant c")
    Long getTotalChants();
    
    @Query("SELECT new com.avics.chant.dto.UserChantResponse(c.userIdentifier, SUM(c.chantCount)) " +
    	       "FROM Chant c GROUP BY c.userIdentifier")
    	List<UserChantResponse> getUserChantCounts();

    
}
