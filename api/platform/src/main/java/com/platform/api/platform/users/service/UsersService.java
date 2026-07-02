package com.platform.api.platform.users.service;

import com.platform.api.platform.users.dto.ChangePasswordResponse;
import com.platform.api.platform.users.dto.CheckDuplicateResponse;
import com.platform.api.platform.users.dto.SendOtpResponse;
import com.platform.api.platform.users.dto.UsersSignupRequest;
import com.platform.api.platform.users.dto.UsersSignupResponse;
import com.platform.datasource.platform.config.database.PlatformTransactional;
import com.platform.datasource.platform.jooq.generated.tables.pojos.UsersEntity;
import com.platform.datasource.platform.repository.users.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * 회원 관리 비즈니스 로직을 처리하는 Service.
 *
 * <p>회원 가입, 중복 확인, 비밀번호 변경 등 회원 관련 핵심 기능을 제공한다.
 * 모든 메서드는 {@link PlatformTransactional}을 통해 트랜잭션이 관리된다.</p>
 *
 * @author Platform Team
 * @since 1.0
 */
@Service
@RequiredArgsConstructor
public class UsersService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;

    /**
     * 신규 회원을 등록한다.
     *
     * <p>아이디와 이메일 중복 확인 후 사용자를 생성하고 USER 권한을 부여한다.
     * 비밀번호는 {@link PasswordEncoder}를 통해 암호화하여 저장한다.</p>
     *
     * @param request 회원 가입 요청 정보 (아이디, 이름, 이메일, 비밀번호)
     * @return 생성된 회원의 시퀀스와 기본 정보를 담은 응답
     * @throws IllegalStateException 아이디 또는 이메일이 이미 존재하는 경우
     */
    @PlatformTransactional
    public UsersSignupResponse signup(UsersSignupRequest request) {
        if (usersRepository.existsByUserId(request.userId())) {
            throw new IllegalStateException("이미 사용 중인 아이디입니다.");
        }
        if (usersRepository.existsByEmail(request.userEmail())) {
            throw new IllegalStateException("이미 사용 중인 이메일입니다.");
        }

        UsersEntity user = new UsersEntity();
        user.setUserId(request.userId());
        user.setUserName(request.userName());
        user.setUserEmail(request.userEmail());
        user.setUserPassword(passwordEncoder.encode(request.password()));
        user.setCreatedBy(0L);

        Long userSeq = usersRepository.insertUser(user);
        Long roleSeq = usersRepository.findRoleSeqByName("USER");
        usersRepository.insertUserRole(userSeq, roleSeq, 0L);

        return toResponse(userSeq, request);
    }

    /**
     * 회원 가입 응답 DTO를 생성한다.
     *
     * @param seq 생성된 회원 시퀀스
     * @param request 회원 가입 요청 정보
     * @return 회원 가입 응답 DTO
     */
    private UsersSignupResponse toResponse(Long seq, UsersSignupRequest request) {
        return new UsersSignupResponse(seq, request.userId(), request.userName());
    }

    // ========== 이슈 #1: 아이디 중복 확인 API ==========

    /**
     * 아이디 중복 여부를 확인한다.
     *
     * <p>아이디가 이미 사용 중인 경우 예외를 던지고, 사용 가능한 경우
     * {@code available} 상태의 응답을 반환한다.</p>
     *
     * @param userId 중복 확인할 아이디
     * @return 사용 가능한 경우 {@code available} 상태 응답
     * @throws IllegalStateException 아이디가 이미 사용 중인 경우
     */
    @PlatformTransactional(readOnly = true)
    public CheckDuplicateResponse checkDuplicateUserId(String userId) {
        if (usersRepository.existsByUserId(userId)) {
            throw new IllegalStateException("이미 사용 중인 아이디입니다.");
        }
        return CheckDuplicateResponse.ofAvailable();
    }

    // ========== 이슈 #2: 이메일 중복 확인 API ==========

    /**
     * 이메일 중복 여부를 확인한다.
     *
     * <p>이메일이 이미 사용 중인 경우 예외를 던지고, 사용 가능한 경우
     * {@code available} 상태의 응답을 반환한다.</p>
     *
     * @param userEmail 중복 확인할 이메일
     * @return 사용 가능한 경우 {@code available} 상태 응답
     * @throws IllegalStateException 이메일이 이미 사용 중인 경우
     */
    @PlatformTransactional(readOnly = true)
    public CheckDuplicateResponse checkDuplicateUserEmail(String userEmail) {
        if (usersRepository.existsByEmail(userEmail)) {
            throw new IllegalStateException("이미 사용 중인 이메일입니다.");
        }
        return CheckDuplicateResponse.ofAvailable();
    }

    // ========== 이슈 #3: OTP 방식 비밀번호 변경 API (로그인 전) ==========

    /**
     * OTP로 본인 확인 후 로그인 전 상태에서 비밀번호를 변경한다.
     *
     * <p>OTP 검증을 통해 본인 확인 후 사용자를 조회하고 새 비밀번호로 변경한다.
     * 비밀번호 변경 시 수정자는 시스템(0L)으로 기록된다.</p>
     *
     * @param userEmail 사용자 이메일
     * @param newPassword 새 비밀번호
     * @param otpCode OTP 코드
     * @return 비밀번호 변경 성공 응답
     * @throws IllegalArgumentException OTP가 만료되었거나 일치하지 않는 경우
     * @throws IllegalArgumentException 해당 이메일로 등록된 사용자가 없는 경우
     * @throws IllegalStateException 새 비밀번호가 현재 비밀번호와 동일한 경우
     */
    @PlatformTransactional
    public ChangePasswordResponse changePasswordBeforeLogin(
            String userEmail,
            String newPassword,
            String otpCode
    ) {
        // 1. OTP 검증
        if (!otpService.verify(userEmail, otpCode)) {
            throw new IllegalArgumentException("OTP가 만료되었습니다. 다시 발송해주세요.");
        }

        // 2. 사용자 조회
        UsersEntity user = usersRepository.findByUserEmail(userEmail);
        if (user == null) {
            throw new IllegalArgumentException("해당 이메일로 등록된 사용자가 없습니다.");
        }

        // 3. 새 비밀번호가 현재와 다른지 검증
        if (passwordEncoder.matches(newPassword, user.getUserPassword())) {
            throw new IllegalStateException("현재 비밀번호와 동일한 비밀번호로 변경할 수 없습니다.");
        }

        // 4. 비밀번호 변경
        String encodedNewPassword = passwordEncoder.encode(newPassword);
        usersRepository.updatePassword(user.getSeq(), encodedNewPassword, 0L);

        return ChangePasswordResponse.ofSuccess();
    }

    // ========== 이슈 3 (issue-3.md): 회원가입용 OTP 발송 (미가입 허용) ==========

    /**
     * 미가입 이메일에 회원가입용 OTP를 발송한다.
     *
     * <p>이메일이 미가입일 때 정상 동작하며, 이미 가입된 경우 예외를 던진다.
     * 미가입인 경우 {@link OtpService#generateAndSaveForSignup(String)}에 위임한다.</p>
     *
     * @param userEmail 회원가입 OTP를 발송할 이메일
     * @return OTP 발송 성공 응답
     * @throws IllegalStateException 이미 가입된 이메일인 경우
     */
    @PlatformTransactional
    public SendOtpResponse sendSignupOtp(String userEmail) {
        // 1. 이미 가입된 이메일인지 확인
        if (usersRepository.existsByEmail(userEmail)) {
            throw new IllegalStateException("이미 가입된 이메일입니다.");
        }

        // 2. 회원가입용 OTP 발송 (미가입 허용)
        return otpService.generateAndSaveForSignup(userEmail);
    }

    // ========== 이슈 #4: 비밀번호 변경 API (로그인 후) ==========

    /**
     * 로그인 후 상태에서 비밀번호를 변경한다.
     *
     * <p>JWT 인증을 통해 획득한 사용자 시퀀스로 사용자를 조회하고
     * 현재 비밀번호 검증 후 새 비밀번호로 변경한다.
     * 비밀번호 변경 시 수정자는 사용자 본인으로 기록된다.</p>
     *
     * @param seq 사용자 시퀀스 (JWT 토큰에서 추출)
     * @param currentPassword 현재 비밀번호 (원본)
     * @param newPassword 새 비밀번호
     * @return 비밀번호 변경 성공 응답
     * @throws IllegalArgumentException 해당 시퀀스의 사용자가 없는 경우
     * @throws IllegalArgumentException 현재 비밀번호가 일치하지 않는 경우
     * @throws IllegalStateException 새 비밀번호가 현재 비밀번호와 동일한 경우
     */
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

        return ChangePasswordResponse.ofSuccess();
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
