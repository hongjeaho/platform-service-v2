package com.platform.api.platform.users.service;

import com.platform.api.platform.users.dto.ChangePasswordBeforeLoginRequest;
import com.platform.api.platform.users.dto.ChangePasswordResponse;
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

    // ========== 이슈 #2: 이메일 중복 확인 API ==========

    @PlatformTransactional(readOnly = true)
    public CheckDuplicateResponse checkDuplicateUserEmail(String userEmail) {
        if (usersRepository.existsByEmail(userEmail)) {
            throw new IllegalStateException("이미 사용 중인 이메일입니다.");
        }
        return CheckDuplicateResponse.available();
    }

    // ========== 이슈 #3: 비밀번호 변경 API (로그인 전) ==========

    @PlatformTransactional
    public ChangePasswordResponse changePasswordBeforeLogin(
            String userEmail,
            String currentPassword,
            String newPassword
    ) {
        // 1. 사용자 조회
        UsersEntity user = usersRepository.findByUserEmail(userEmail);
        if (user == null) {
            throw new IllegalArgumentException("해당 이메일로 등록된 사용자가 없습니다.");
        }

        // 2. 비밀번호 검증 (private 메서드 위임)
        validatePasswordChange(currentPassword, user.getUserPassword(), newPassword);

        // 3. 비밀번호 변경
        String encodedNewPassword = passwordEncoder.encode(newPassword);
        usersRepository.updatePassword(user.getSeq(), encodedNewPassword, 0L);

        return ChangePasswordResponse.success();
    }

    // ========== 이슈 #4: 비밀번호 변경 API (로그인 후) ==========

    @PlatformTransactional
    public ChangePasswordResponse changePassword(
            Long seq,
            String currentPassword,
            String newPassword
    ) {
        // 1. 사용자 조회
        UsersEntity user = usersRepository.findBySeq(seq);
        if (user == null) {
            throw new IllegalArgumentException("해당 이메일로 등록된 사용자가 없습니다.");
        }

        // 2. 비밀번호 검증 (private 메서드 위임)
        validatePasswordChange(currentPassword, user.getUserPassword(), newPassword);

        // 3. 비밀번호 변경
        String encodedNewPassword = passwordEncoder.encode(newPassword);
        usersRepository.updatePassword(seq, encodedNewPassword, seq);

        return ChangePasswordResponse.success();
    }

    // ========== Private 메서드: 비밀번호 변경 검증 (중복 제거) ==========

    /**
     * 비밀번호 변경 시 검증 로직
     *
     * @param currentPassword    현재 비밀번호 (원본)
     * @param encodedPassword   저장된 암호화된 비밀번호
     * @param newPassword       새 비밀번호
     * @throws IllegalArgumentException 현재 비밀번호가 일치하지 않을 때
     * @throws IllegalStateException    새 비밀번호가 현재와 동일할 때
     */
    private void validatePasswordChange(String currentPassword, String encodedPassword, String newPassword) {
        if (!passwordEncoder.matches(currentPassword, encodedPassword)) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }
        if (currentPassword.equals(newPassword)) {
            throw new IllegalStateException("현재 비밀번호와 동일합니다.");
        }
    }
}
