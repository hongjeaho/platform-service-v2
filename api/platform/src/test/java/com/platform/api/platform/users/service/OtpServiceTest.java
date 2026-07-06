package com.platform.api.platform.users.service;

import com.platform.api.platform.users.type.OtpPurpose;
import com.platform.common.core.email.OtpEmailSender;
import com.platform.common.core.email.OtpTemplate;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("OTP 발급·검증 Service 단위 테스트 (용도 기반)")
class OtpServiceTest {

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private OtpEmailSender emailSender;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private OtpService otpService;

    // ========== 슬라이스 1: 용도별(purpose-scoped) 발급 ==========

    @Test
    @DisplayName("issue(email, SIGNUP)는 Redis에 otp:SIGNUP:{email} 키로 30분 TTL 저장한다")
    void issue_saveOtpWithPurposeScopedKey_whenSignupPurposeGiven() {
        // Given
        String userEmail = "test@example.com";
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(redisTemplate.hasKey(anyString())).thenReturn(false);

        // When
        otpService.issue(userEmail, OtpPurpose.SIGNUP);

        // Then
        verify(valueOperations).set(eq("otp:SIGNUP:test@example.com"), anyString(), eq(30L), any());
    }

    @Test
    @DisplayName("issue(email, SIGNUP)는 purpose-scoped 재발송 throttle 키로 last-sent를 저장한다")
    void issue_saveLastSentWithPurposeScopedKey_whenSignupPurposeGiven() {
        // Given
        String userEmail = "test@example.com";
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(redisTemplate.hasKey(anyString())).thenReturn(false);

        // When
        otpService.issue(userEmail, OtpPurpose.SIGNUP);

        // Then
        verify(valueOperations).set(eq("otp:last-sent:SIGNUP:test@example.com"), anyString(), eq(10L), any());
    }

    @Test
    @DisplayName("issue(email, SIGNUP)는 SIGNUP 템플릿으로 이메일을 발송한다")
    void issue_sendEmailWithSignupTemplate_whenSignupPurposeGiven() {
        // Given
        String userEmail = "test@example.com";
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(redisTemplate.hasKey(anyString())).thenReturn(false);

        // When
        otpService.issue(userEmail, OtpPurpose.SIGNUP);

        // Then
        verify(emailSender).send(eq(userEmail), anyString(), eq(OtpTemplate.SIGNUP));
    }

    @Test
    @DisplayName("issue(email, PASSWORD_CHANGE)는 PASSWORD_CHANGE 템플릿으로 이메일을 발송한다")
    void issue_sendEmailWithPasswordChangeTemplate_whenPasswordChangePurposeGiven() {
        // Given
        String userEmail = "test@example.com";
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(redisTemplate.hasKey(anyString())).thenReturn(false);

        // When
        otpService.issue(userEmail, OtpPurpose.PASSWORD_CHANGE);

        // Then
        verify(emailSender).send(eq(userEmail), anyString(), eq(OtpTemplate.PASSWORD_CHANGE));
    }

    @Test
    @DisplayName("재발송 간격이 경과하지 않으면 issue()는 IllegalStateException을 던진다")
    void issue_throwsIllegalStateException_whenResendIntervalNotPassed() {
        // Given
        String userEmail = "test@example.com";
        when(redisTemplate.hasKey(anyString())).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> otpService.issue(userEmail, OtpPurpose.PASSWORD_CHANGE))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("OTP는 10분마다 재발송할 수 있습니다.");
    }

    // ========== 슬라이스 2: 용도별 검증 (교차 만족 차단) ==========

    @Test
    @DisplayName("verify(email, code, PASSWORD_CHANGE)는 otp:PASSWORD_CHANGE:{email}에서 조회해 일치 시 true·삭제한다")
    void verify_lookupPurposeScopedKeyAndDelete_whenCodeMatches() {
        // Given
        String userEmail = "test@example.com";
        String otpCode = "123456";
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("otp:PASSWORD_CHANGE:test@example.com")).thenReturn("123456");

        // When
        boolean result = otpService.verify(userEmail, otpCode, OtpPurpose.PASSWORD_CHANGE);

        // Then
        assertThat(result).isTrue();
        verify(redisTemplate).delete("otp:PASSWORD_CHANGE:test@example.com");
    }

    @Test
    @DisplayName("verify는 조회 키를 용도로 한정한다 — 다른 용도 키에 같은 코드가 있어도 false (교차 만족 차단)")
    void verify_returnsFalse_whenCodeStoredUnderDifferentPurposeKey() {
        // Given: PASSWORD_CHANGE 키에는 코드가 없음 (SIGNUP 키에 있다 해도 본 검증은 모름)
        String userEmail = "test@example.com";
        String otpCode = "123456";
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("otp:PASSWORD_CHANGE:test@example.com")).thenReturn(null);

        // When
        boolean result = otpService.verify(userEmail, otpCode, OtpPurpose.PASSWORD_CHANGE);

        // Then
        assertThat(result).isFalse();
        // PASSWORD_CHANGE 키만 조회 — SIGNUP 키는 절대 건드리지 않는다
        verify(valueOperations).get("otp:PASSWORD_CHANGE:test@example.com");
        verify(valueOperations, never()).get("otp:SIGNUP:test@example.com");
    }

    @Test
    @DisplayName("불일치 코드는 OTP를 삭제하지 않고 false를 반환한다")
    void verify_returnsFalseAndDoesNotDelete_whenCodeMismatch() {
        // Given
        String userEmail = "test@example.com";
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("otp:PASSWORD_CHANGE:test@example.com")).thenReturn("999999");

        // When
        boolean result = otpService.verify(userEmail, "123456", OtpPurpose.PASSWORD_CHANGE);

        // Then
        assertThat(result).isFalse();
        verify(redisTemplate, never()).delete(anyString());
    }
}
