package com.avics.chant.repository;

import com.avics.chant.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	
    Optional<User> findByUsernameIgnoreCase(String username);
    
    Optional<User> findByPhoneNo(String phoneNo);
}
