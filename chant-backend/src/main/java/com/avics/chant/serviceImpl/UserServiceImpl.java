package com.avics.chant.serviceImpl;

import com.avics.chant.dto.ApiResponse;
import com.avics.chant.dto.CreateUserRequest;
import com.avics.chant.entity.User;
import com.avics.chant.repository.UserRepository;
import com.avics.chant.service.UserService;
import com.avics.chant.util.ValidationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ValidationUtil validationUtil;

    @Value("${chant.msg.user.exists}")
    private String userExistsMsg;

    @Value("${chant.msg.user.created}")
    private String userCreatedMsg;

    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    @Override
    public ApiResponse createUser(CreateUserRequest request) {
        try {
            String userId = request.getUserid();

            // Check if user already exists
            if(findUser(userId).isPresent()){
                return new ApiResponse(false, userExistsMsg, null);
            }

            User user = new User();
            
            if(validationUtil.isPhoneNumber(userId)) {
                // If it's a phone number, store in phoneNo field
                user.setPhoneNo(userId);
                log.info("New user created with phone number: {}", userId);
            } else {
                // If it's a custom username, store in username field (uppercase)
                String upperUserId = validationUtil.normalizeUserId(userId);
                user.setUsername(upperUserId);
                log.info("New user created with username: {}", upperUserId);
            }
            
            userRepository.save(user);

            return new ApiResponse(true, userCreatedMsg, userId);

        } catch (Exception e) {
            log.error("Error creating user: {}", e.getMessage(), e);
            return new ApiResponse(false, "Error while creating user", null);
        }
    }

    @Override
    public Optional<User> findUser(String identifier) {
        try {
            if(validationUtil.isPhoneNumber(identifier)) {
                return userRepository.findByPhoneNo(identifier);
            }
            return userRepository.findByUsernameIgnoreCase(identifier);
        } catch (Exception e) {
            log.error("Error finding user: {}", e.getMessage(), e);
            return Optional.empty();
        }
    }

    @Override
    public boolean isUserExists(String identifier) {
        try {
            String normalizedIdentifier = validationUtil.normalizeUserId(identifier);
            return findUser(normalizedIdentifier).isPresent();
        } catch (Exception e) {
            log.error("Error checking user existence: {}", e.getMessage(), e);
            return false;
        }
    }
}
