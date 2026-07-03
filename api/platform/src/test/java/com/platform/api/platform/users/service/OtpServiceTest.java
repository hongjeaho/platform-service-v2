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
import static org.mockito.Mockito.never;
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

    // ========== 이슈 2: OtpTemplate 파라미터 추가 테스트 ==========

    @Test
    @DisplayName("OtpTemplate.PASSWORD_CHANGE가 주어지면 generateAndSave()는 OtpEmailSender에 PASSWORD_CHANGE를 전달한다")
    void generateAndSave_callsEmailSenderWithPasswordChangeTemplate_whenPasswordChangeTemplateGiven() {
        // Given
        String userEmail = "test@example.com";
        when(usersRepository.existsByEmail(userEmail)).thenReturn(true);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(redisTemplate.hasKey(anyString())).thenReturn(false);

        // When
        SendOtpResponse result = otpService.generateAndSave(userEmail, OtpTemplate.PASSWORD_CHANGE);

        // Then
        assertThat(result).isNotNull();
        verify(emailSender).send(eq(userEmail), anyString(), eq(OtpTemplate.PASSWORD_CHANGE));
    }

    @Test
    @DisplayName("OtpTemplate.SIGNUP이 주어지면 generateAndSave()는 OtpEmailSender에 SIGNUP을 전달한다")
    void generateAndSave_callsEmailSenderWithSignupTemplate_whenSignupTemplateGiven() {
        // Given
        String userEmail = "test@example.com";
        when(usersRepository.existsByEmail(userEmail)).thenReturn(true);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(redisTemplate.hasKey(anyString())).thenReturn(false);

        // When
        SendOtpResponse result = otpService.generateAndSave(userEmail, OtpTemplate.SIGNUP);

        // Then
        assertThat(result).isNotNull();
        verify(emailSender).send(eq(userEmail), anyString(), eq(OtpTemplate.SIGNUP));
    }

    @Test
    @DisplayName("등록되지 않은 이메일이 주어지면 generateAndSave()는 IllegalArgumentException을 던진다")
    void generateAndSave_throwsIllegalArgumentException_whenEmailNotRegistered() {
        // Given
        String userEmail = "notregistered@example.com";
        when(usersRepository.existsByEmail(userEmail)).thenReturn(false);

        // When & Then
        assertThatThrownBy(() -> otpService.generateAndSave(userEmail, OtpTemplate.PASSWORD_CHANGE))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("해당 이메일로 등록된 사용자가 없습니다.");
    }

    @Test
    @DisplayName("재발송 간격이 경과하지 않으면 generateAndSave()는 IllegalStateException을 던진다")
    void generateAndSave_throwsIllegalStateException_whenResendIntervalNotPassed() {
        // Given
        String userEmail = "test@example.com";
        when(usersRepository.existsByEmail(userEmail)).thenReturn(true);
        when(redisTemplate.hasKey(anyString())).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> otpService.generateAndSave(userEmail, OtpTemplate.PASSWORD_CHANGE))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("OTP는 10분마다 재발송할 수 있습니다.");
    }

    // ========== 이슈 3: 회원가입용 OTP 발송 (미가입 허용) ==========

    @Test
    @DisplayName("미가입 이메일로 generateAndSaveForSignup 호출 시 existsByEmail 체크 없이 SIGNUP 템플릿으로 이메일을 발송한다")
    void generateAndSaveForSignup_sendEmailWithSignupTemplate_withoutExistsByEmailCheck_whenUnregisteredEmail() {
        // Given
        String userEmail = "newuser@example.com";
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(redisTemplate.hasKey(anyString())).thenReturn(false);

        // When
        SendOtpResponse result = otpService.generateAndSaveForSignup(userEmail);

        // Then
        assertThat(result).isNotNull();
        verify(emailSender).send(eq(userEmail), anyString(), eq(OtpTemplate.SIGNUP));
        verify(usersRepository, never()).existsByEmail(anyString());
    }

    @Test
    @DisplayName("재발송 간격이 경과하지 않으면 generateAndSaveForSignup은 IllegalStateException을 던진다")
    void generateAndSaveForSignup_throwsIllegalStateException_whenResendIntervalNotPassed() {
        // Given
        String userEmail = "newuser@example.com";
        when(redisTemplate.hasKey(anyString())).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> otpService.generateAndSaveForSignup(userEmail))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("OTP는 10분마다 재발송할 수 있습니다.");
    }

    // ========== 회귀 테스트 (기존 동작 보존) ==========

    @Test
    @DisplayName("등록된 이메일로 OTP 발송 요청 시 6자리 OTP를 생성하고 Redis에 30분 TTL로 저장한다")
    void generateAndSave_shouldGenerate6DigitOtpAndSaveToRedisWith30minTTL_whenRegisteredEmail() {
        // Given
        String userEmail = "test@example.com";
        when(usersRepository.existsByEmail(userEmail)).thenReturn(true);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(redisTemplate.hasKey(anyString())).thenReturn(false);

        // When
        otpService.generateAndSave(userEmail, OtpTemplate.PASSWORD_CHANGE);

        // Then
        verify(valueOperations).set(eq("otp:test@example.com"), anyString(), eq(30L), any());
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
        otpService.generateAndSave(userEmail, OtpTemplate.PASSWORD_CHANGE);

        // Then
        verify(valueOperations).set(eq("otp:last-sent:test@example.com"), anyString(), eq(10L), any());
    }
}
