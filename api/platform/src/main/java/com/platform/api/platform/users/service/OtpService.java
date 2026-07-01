package com.platform.api.platform.users.service;

import com.platform.api.platform.users.dto.SendOtpResponse;
import com.platform.common.core.email.PasswordChangeEmailSender;
import com.platform.datasource.platform.config.database.PlatformTransactional;
import com.platform.datasource.platform.repository.users.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

/**
 * OTP 발송 및 검증 비즈니스 로직을 처리하는 Service.
 *
 * <p>OTP 생성·Redis 저장·이메일 발송, 재발송 간격 확인 등 OTP 관련 기능을 제공한다.
 * 모든 메서드는 {@link PlatformTransactional}을 통해 트랜잭션이 관리된다.</p>
 *
 * @author Platform Team
 * @since 1.0
 */
@Service
@RequiredArgsConstructor
public class OtpService {

    private final UsersRepository usersRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final PasswordChangeEmailSender emailSender;

    private static final String OTP_KEY_PREFIX = "otp:";
    private static final String LAST_SENT_KEY_PREFIX = "otp:last-sent:";
    private static final int OTP_TTL_MINUTES = 30;
    private static final int RESEND_INTERVAL_MINUTES = 10;
    private static final int OTP_LENGTH = 6;

    /**
     * OTP를 생성하고 Redis에 저장한 후 이메일로 발송한다.
     *
     * <p>1. 사용자 이메일 등록 여부 확인
     * 2. 재발송 간격 확인 (10분)
     * 3. 6자리 OTP 생성
     * 4. Redis에 OTP 저장 (TTL 30분)
     * 5. 마지막 발송 시간 저장
     * 6. 이메일 발송</p>
     *
     * @param userEmail OTP를 발송할 사용자 이메일
     * @return OTP 발송 성공 응답
     * @throws IllegalArgumentException 등록되지 않은 이메일인 경우
     * @throws IllegalStateException 10분 미경과 재발송 요청인 경우
     */
    @PlatformTransactional
    public SendOtpResponse generateAndSave(String userEmail) {
        // 1. 사용자 등록 여부 확인
        if (!usersRepository.existsByEmail(userEmail)) {
            throw new IllegalArgumentException("해당 이메일로 등록된 사용자가 없습니다.");
        }

        // 2. 재발송 간격 확인 (10분 미경과 시 예외)
        Boolean hasLastSent = redisTemplate.hasKey(LAST_SENT_KEY_PREFIX + userEmail);
        if (hasLastSent) {
            throw new IllegalStateException("OTP는 10분마다 재발송할 수 있습니다.");
        }

        // 3. 6자리 OTP 생성
        String otpCode = generateOtpCode();

        // 4. Redis에 OTP 저장 (30분 TTL)
        String otpKey = OTP_KEY_PREFIX + userEmail;
        redisTemplate.opsForValue().set(otpKey, otpCode, OTP_TTL_MINUTES, TimeUnit.MINUTES);

        // 5. 마지막 발송 시간 저장 (10분 TTL)
        String lastSentKey = LAST_SENT_KEY_PREFIX + userEmail;
        redisTemplate.opsForValue().set(lastSentKey, String.valueOf(System.currentTimeMillis()), RESEND_INTERVAL_MINUTES, TimeUnit.MINUTES);

        // 6. 이메일 발송 (비동기)
        emailSender.send(userEmail, otpCode);

        return SendOtpResponse.ofSuccess();
    }

    /**
     * 6자리 OTP 코드를 생성한다.
     *
     * @return 6자리 숫자 문자열
     */
    private String generateOtpCode() {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    /**
     * OTP를 검증한다.
     *
     * <p>Redis에서 OTP를 조회하고 일치 여부를 확인한다.
     * 검증 성공 시 Redis에서 OTP를 삭제한다.</p>
     *
     * @param userEmail 사용자 이메일
     * @param otpCode 사용자가 입력한 OTP 코드
     * @return OTP 일치 여부
     */
    @PlatformTransactional
    public boolean verify(String userEmail, String otpCode) {
        String otpKey = OTP_KEY_PREFIX + userEmail;
        String storedOtp = redisTemplate.opsForValue().get(otpKey);

        if (storedOtp == null) {
            return false;
        }

        boolean isValid = storedOtp.equals(otpCode);

        if (isValid) {
            redisTemplate.delete(otpKey);
        }

        return isValid;
    }
}
