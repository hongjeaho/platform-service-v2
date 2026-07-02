package com.platform.api.platform.users.service;

import com.platform.api.platform.users.dto.SendOtpResponse;
import com.platform.common.core.email.OtpEmailSender;
import com.platform.common.core.email.OtpTemplate;
import com.platform.datasource.platform.repository.users.UsersRepository;
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
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("OTP 발송 Service 단위 테스트")
class OtpServiceTest {

    @Mock
    private UsersRepository usersRepository;

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private OtpEmailSender emailSender;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private OtpService otpService;

    @Test
    @DisplayName("등록된 이메일로 OTP 발송 요청 시 6자리 OTP를 생성하고 Redis에 30분 TTL로 저장한다")
    void generateAndSave_shouldGenerate6DigitOtpAndSaveToRedisWith30minTTL_whenRegisteredEmail() {
        // Given
        String userEmail = "test@example.com";
        when(usersRepository.existsByEmail(userEmail)).thenReturn(true);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(redisTemplate.hasKey(anyString())).thenReturn(false);

        // When
        otpService.generateAndSave(userEmail);

        // Then
        verify(valueOperations).set(eq("otp:test@example.com"), anyString(), eq(30L), any());
    }

    @Test
    @DisplayName("OTP가 Redis에 저장되었을 때 OtpEmailSender를 사용하여 이메일을 발송한다 (회귀 테스트)")
    void generateAndSave_shouldSendEmailViaOtpEmailSender_whenOtpSaved() {
        // Given
        String userEmail = "test@example.com";
        when(usersRepository.existsByEmail(userEmail)).thenReturn(true);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(redisTemplate.hasKey(anyString())).thenReturn(false);

        // When
        otpService.generateAndSave(userEmail);

        // Then - OtpEmailSender로 의존성이 교체되었는지 검증
        verify(emailSender).send(eq(userEmail), anyString(), eq(OtpTemplate.PASSWORD_CHANGE));
    }

    @Test
    @DisplayName("등록된 이메일로 OTP 발송 요청 시 OtpEmailSender와 통합되어 정상 동작한다 (회귀 테스트)")
    void generateAndSave_shouldWorkWithOtpEmailSenderDependency_whenRegisteredEmail() {
        // Given
        String userEmail = "test@example.com";
        when(usersRepository.existsByEmail(userEmail)).thenReturn(true);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(redisTemplate.hasKey(anyString())).thenReturn(false);

        // When
        SendOtpResponse result = otpService.generateAndSave(userEmail);

        // Then - OtpEmailSender를 사용하여 PASSWORD_CHANGE 템플릿으로 발송
        verify(emailSender).send(eq(userEmail), anyString(), eq(OtpTemplate.PASSWORD_CHANGE));
        assertThat(result.message()).isEqualTo("OTP가 이메일로 발송되었습니다.");
    }

    @Test
    @DisplayName("첫 요청 시 Redis에 마지막 발송 시간을 설정한다")
    void generateAndSave_shouldSetLastSentTimestampInRedis_whenFirstRequest() {
        // Given
        String userEmail = "test@example.com";
        when(usersRepository.existsByEmail(userEmail)).thenReturn(true);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(redisTemplate.hasKey(anyString())).thenReturn(false);

        // When
        otpService.generateAndSave(userEmail);

        // Then
        verify(valueOperations).set(eq("otp:last-sent:test@example.com"), anyString(), eq(10L), any());
    }

    @Test
    @DisplayName("등록되지 않은 이메일로 OTP 발송 요청 시 IllegalArgumentException이 발생한다")
    void generateAndSave_shouldThrowIllegalArgumentException_whenEmailIsNotRegistered() {
        // Given
        String userEmail = "unregistered@example.com";
        when(usersRepository.existsByEmail(userEmail)).thenReturn(false);

        // When & Then
        assertThatThrownBy(() -> otpService.generateAndSave(userEmail))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("해당 이메일로 등록된 사용자가 없습니다");
    }

    @Test
    @DisplayName("10분 미경과 상태에서 재발송 요청 시 IllegalStateException이 발생한다")
    void generateAndSave_shouldThrowIllegalStateException_whenResendIntervalLessThan10min() {
        // Given
        String userEmail = "test@example.com";
        when(usersRepository.existsByEmail(userEmail)).thenReturn(true);
        when(redisTemplate.hasKey(eq("otp:last-sent:test@example.com")))
            .thenReturn(true); // 10분 미경과

        // When & Then
        assertThatThrownBy(() -> otpService.generateAndSave(userEmail))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("OTP는 10분마다 재발송할 수 있습니다");
    }
}
