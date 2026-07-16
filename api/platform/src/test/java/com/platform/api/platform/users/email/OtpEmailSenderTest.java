package com.platform.api.platform.users.email;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;

import com.platform.common.core.email.TemplateMailSender;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class OtpEmailSenderTest {

    @Mock
    private TemplateMailSender templateMailSender;

    @InjectMocks
    private OtpEmailSender otpEmailSender;

    @Test
    @DisplayName("SIGNUP 용도는 '인증 코드' 제목과 signup-verification 템플릿으로 발송한다")
    void sendsSignupOtpWithSignupTemplate() {
        otpEmailSender.send("user@example.com", "123456", OtpTemplate.SIGNUP);

        verify(templateMailSender).send(
            "user@example.com", "인증 코드", "signup-verification", Map.of("otpCode", "123456"));
    }

    @Test
    @DisplayName("PASSWORD_CHANGE 용도는 password-change-verification 템플릿으로 발송한다")
    void sendsPasswordChangeOtpWithPasswordChangeTemplate() {
        otpEmailSender.send("user@example.com", "654321", OtpTemplate.PASSWORD_CHANGE);

        verify(templateMailSender).send(
            "user@example.com", "인증 코드", "password-change-verification", Map.of("otpCode", "654321"));
    }

    @Test
    @DisplayName("OTP 코드가 blank면 IllegalArgumentException을 던진다")
    void rejectsBlankOtpCode() {
        assertThatThrownBy(() -> otpEmailSender.send("user@example.com", " ", OtpTemplate.SIGNUP))
            .isInstanceOf(IllegalArgumentException.class);
    }
}
