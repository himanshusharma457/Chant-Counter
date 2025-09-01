package com.avics.chant.serviceImpl;

import com.avics.chant.dto.*;
import com.avics.chant.entity.Chant;
import com.avics.chant.repository.ChantRepository;
import com.avics.chant.service.ChantService;
import com.avics.chant.service.UserService;
import com.avics.chant.util.ValidationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChantServiceImpl implements ChantService {

    @Autowired
    private ChantRepository chantRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ValidationUtil validationUtil;

    @Value("${chant.msg.chant.added}")
    private String chantAddedMsg;

    @Value("${chant.msg.user.notfound}")
    private String userNotFoundMsg;

    private static final Logger log = LoggerFactory.getLogger(ChantServiceImpl.class);

    @Override
    public ApiResponse addChant(AddChantRequest request) {
        try {
            String userId = validationUtil.normalizeUserId(request.getUserid());
            Optional<com.avics.chant.entity.User> userOpt = userService.findUser(userId);

            if(!userOpt.isPresent()) {
                if(validationUtil.isPhoneNumber(userId)) {
                    // auto-register phone-based user
                    com.avics.chant.entity.User newUser = new com.avics.chant.entity.User();
                    newUser.setPhoneNo(userId);
                    newUser.setUsername(userId);
                    userService.createUser(new CreateUserRequest(userId));
                } else {
                    return new ApiResponse(false, userNotFoundMsg, null);
                }
            }

            Chant chant = new Chant();
            chant.setUserIdentifier(userId);
            chant.setChantDate(request.getDate());
            chant.setChantCount(request.getCount());
            chantRepository.save(chant);

            Long total = chantRepository.getUserTotal(userId);
            log.info("Chant added for {} with count {}. Total={}", userId, request.getCount(), total);

            return new ApiResponse(true, chantAddedMsg, new UserTotalResponse(userId, total));

        } catch (Exception e) {
            log.error("Error adding chant: {}", e.getMessage(), e);
            return new ApiResponse(false, "Error while adding chant", null);
        }
    }

    @Override
    public UserTotalResponse getUserTotal(String userId) {
        try {
            Long total = chantRepository.getUserTotal(validationUtil.normalizeUserId(userId));
            return new UserTotalResponse(userId, total != null ? total : 0);
        } catch (Exception e) {
            log.error("Error fetching user total: {}", e.getMessage(), e);
            return new UserTotalResponse(userId, 0L);
        }
    }

    @Override
    public TotalChantsResponse getTotalChants() {
        try {
            Long total = chantRepository.getTotalChants();
            return new TotalChantsResponse(total != null ? total : 0);
        } catch (Exception e) {
            log.error("Error fetching total chants: {}", e.getMessage(), e);
            return new TotalChantsResponse(0L);
        }
    }

    @Override
    public List<UserChantResponse> getAllUserChantCounts() {
        return chantRepository.getUserChantCounts();
    }
}
