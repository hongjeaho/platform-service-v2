package com.platform.api.platform.users.service;

import com.platform.api.platform.users.dto.CheckDuplicateResponse;
import com.platform.api.platform.users.dto.UsersSignupRequest;
import com.platform.api.platform.users.dto.UsersSignupResponse;
import com.platform.datasource.platform.config.database.PlatformTransactional;
import com.platform.datasource.platform.jooq.generated.tables.pojos.UsersEntity;
import com.platform.datasource.platform.repository.users.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsersService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    @PlatformTransactional
    public UsersSignupResponse signup(UsersSignupRequest request) {
        if (usersRepository.existsByUserId(request.getUserId())) {
            throw new IllegalStateException("이미 사용 중인 아이디입니다.");
        }
        if (usersRepository.existsByEmail(request.getUserEmail())) {
            throw new IllegalStateException("이미 사용 중인 이메일입니다.");
        }

        UsersEntity user = new UsersEntity();
        user.setUserId(request.getUserId());
        user.setUserName(request.getUserName());
        user.setUserEmail(request.getUserEmail());
        user.setUserPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedBy(0L);

        Long userSeq = usersRepository.insertUser(user);
        Long roleSeq = usersRepository.findRoleSeqByName("USER");
        usersRepository.insertUserRole(userSeq, roleSeq, 0L);

        return toResponse(userSeq, request);
    }

    private UsersSignupResponse toResponse(Long seq, UsersSignupRequest request) {
        UsersSignupResponse response = new UsersSignupResponse();
        response.setSeq(seq);
        response.setUserId(request.getUserId());
        response.setUserName(request.getUserName());
        return response;
    }

    // ========== 이슈 #1: 아이디 중복 확인 API ==========

    @PlatformTransactional(readOnly = true)
    public CheckDuplicateResponse checkDuplicateUserId(String userId) {
        if (usersRepository.existsByUserId(userId)) {
            throw new IllegalStateException("이미 사용 중인 아이디입니다.");
        }
        return CheckDuplicateResponse.available();
    }
}
