package com.platform.api.platform.users.service;

import com.platform.api.platform.users.dto.SendOtpResponse;
import com.platform.api.platform.users.type.OtpPurpose;
import com.platform.api.platform.users.email.OtpEmailSender;
import com.platform.api.platform.users.email.OtpTemplate;
import com.platform.datasource.platform.config.database.PlatformTransactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

/**
 * OTP 발급·검증 메커니즘.
 *
 * <p>OTP 코드 생성·Redis 저장·이메일 발송·재발송 throttle을 용도({@link OtpPurpose})별로 독립 수행한다.
 * 각 용도는 별도의 Redis 네임스페이스({@code otp:{purpose}:{email}})와 별도의 throttle을 가지며,
 * 서로 교차 만족할 수 없다. OTP 머신은 회원 가입 여부를 알지 못한다 — 용도별 사전조건(가입/미가입)은
 * 호출자(회원 도메인)가 소유한다 (ADR-0001).</p>
 *
 * @author Platform Team
 * @since 1.0
 */
@Service
@RequiredArgsConstructor
public class OtpService {

    private final RedisTemplate<String, String> redisTemplate;
    private final OtpEmailSender emailSender;

    private static final String OTP_KEY_PREFIX = "otp:";
    private static final String LAST_SENT_KEY_PREFIX = "otp:last-sent:";
    private static final int OTP_TTL_MINUTES = 30;
    private static final int RESEND_INTERVAL_MINUTES = 10;
    private static final int OTP_LENGTH = 6;

    /**
     * OTP를 생성하고 Redis에 저장한 후 이메일로 발송한다 (용도 기반).
     *
     * <p>1. 재발송 간격 확인 (10분 미경과 시 예외, purpose-scoped)
     * 2. 6자리 OTP 생성
     * 3. Redis에 OTP 저장 (purpose-scoped, TTL 30분)
     * 4. 마지막 발송 시간 저장 (purpose-scoped, TTL 10분)
     * 5. 이메일 발송 (purpose → 템플릿 매핑)</p>
     *
     * @param userEmail OTP를 발송할 이메일
     * @param purpose OTP 검증 용도
     * @return OTP 발송 성공 응답
     * @throws IllegalStateException 10분 미경과 재발송 요청인 경우
     */
    @PlatformTransactional
    public SendOtpResponse issue(String userEmail, OtpPurpose purpose) {
        // 1. 재발송 간격 확인 (purpose-scoped)
        String lastSentKey = LAST_SENT_KEY_PREFIX + purpose.name() + ":" + userEmail;
        if (redisTemplate.hasKey(lastSentKey)) {
            throw new IllegalStateException("OTP는 10분마다 재발송할 수 있습니다.");
        }

        // 2. 6자리 OTP 생성
        String otpCode = generateOtpCode();

        // 3. Redis에 OTP 저장 (purpose-scoped, 30분 TTL)
        String otpKey = OTP_KEY_PREFIX + purpose.name() + ":" + userEmail;
        redisTemplate.opsForValue().set(otpKey, otpCode, OTP_TTL_MINUTES, TimeUnit.MINUTES);

        // 4. 마지막 발송 시간 저장 (purpose-scoped, 10분 TTL)
        redisTemplate.opsForValue().set(lastSentKey, String.valueOf(System.currentTimeMillis()),
                RESEND_INTERVAL_MINUTES, TimeUnit.MINUTES);

        // 5. 이메일 발송 (purpose → 템플릿 매핑)
        emailSender.send(userEmail, otpCode, toTemplate(purpose));

        return SendOtpResponse.ofSuccess();
    }

    /**
     * OTP를 검증한다 (용도 기반).
     *
     * <p>용도별 독립 Redis 네임스페이스에서 조회하므로, 한 용도로 발급된 코드는 다른 용도의 검증을
     * 통과하지 못한다 (교차 만족 불가). 검증 성공 시 해당 용도 키에서만 OTP를 삭제한다.</p>
     *
     * @param userEmail 사용자 이메일
     * @param otpCode 사용자가 입력한 OTP 코드
     * @param purpose OTP 검증 용도
     * @return OTP 일치 여부
     */
    @PlatformTransactional
    public boolean verify(String userEmail, String otpCode, OtpPurpose purpose) {
        String otpKey = OTP_KEY_PREFIX + purpose.name() + ":" + userEmail;
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
     * OTP 검증 용도를 이메일 템플릿으로 매핑한다.
     *
     * <p>도메인 개념(OtpPurpose)과 presentation(OtpTemplate)의 의존성 방향을 보존하기 위해
     * 매핑은 OTP 기계 내부에 한정한다.</p>
     *
     * @param purpose OTP 검증 용도
     * @return 대응하는 이메일 템플릿
     */
    private OtpTemplate toTemplate(OtpPurpose purpose) {
        return switch (purpose) {
            case SIGNUP -> OtpTemplate.SIGNUP;
            case PASSWORD_CHANGE -> OtpTemplate.PASSWORD_CHANGE;
        };
    }
}
