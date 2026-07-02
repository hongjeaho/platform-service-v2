package com.platform.common.core.email;

import com.platform.common.core.config.properties.EmailProperties;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.mail.javamail.JavaMailSender;
import org.thymeleaf.context.IContext;
import org.thymeleaf.spring6.SpringTemplateEngine;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class PasswordChangeEmailSenderTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private SpringTemplateEngine templateEngine;

    private MimeMessage mimeMessage;
    private PasswordChangeEmailSender passwordChangeEmailSender;

    @BeforeEach
    void setUp() {
        mimeMessage = mock(MimeMessage.class);
        EmailProperties emailProperties = new EmailProperties("noreply@test.com", "Platform");
        passwordChangeEmailSender = new PasswordChangeEmailSender(mailSender, templateEngine, emailProperties);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any())).thenReturn("<html><body>123456</body></html>");
    }

    @Test
    @DisplayName("유효한 to와 otpCode가 주어지면 mailSender.send(MimeMessage)를 1회 호출한다")
    void send_invokeMailSenderOnce_whenValidToAndOtpCodeGiven() {
        // When
        passwordChangeEmailSender.send("to@test.com", "123456");

        // Then — Red: 스켈레톤이 아무것도 하지 않아 verify 실패
        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("유효한 to와 otpCode가 주어지면 MimeMessage subject에 '비밀번호 변경'을 포함한다")
    void send_setSubjectContainingPasswordChange_whenValidGiven() throws Exception {
        // When
        passwordChangeEmailSender.send("to@test.com", "123456");

        // Then — Red: mailSender.send 미호출 → verify 실패
        verify(mailSender).send(any(MimeMessage.class));
        verify(mimeMessage).setSubject(contains("비밀번호 변경"), anyString());
    }

    @Test
    @DisplayName("Thymeleaf 템플릿 처리 시 context에 otpCode가 포함된다")
    void send_renderOtpCodeInBody_whenThymeleafTemplateProcessed() {
        // When
        passwordChangeEmailSender.send("to@test.com", "123456");

        // Then — Red: templateEngine.process 미호출 → verify 실패
        ArgumentCaptor<IContext> contextCaptor = ArgumentCaptor.forClass(IContext.class);
        verify(templateEngine).process(anyString(), contextCaptor.capture());
        assertThat(contextCaptor.getValue().getVariable("otpCode")).isEqualTo("123456");
    }

    @Test
    @DisplayName("to가 null이면 IllegalArgumentException을 던진다")
    void send_throwIllegalArgumentException_whenToIsNull() {
        assertThatThrownBy(() -> passwordChangeEmailSender.send(null, "123456"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("to가 blank이면 IllegalArgumentException을 던진다")
    void send_throwIllegalArgumentException_whenToIsBlank() {
        assertThatThrownBy(() -> passwordChangeEmailSender.send("   ", "123456"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("otpCode가 null이면 IllegalArgumentException을 던진다")
    void send_throwIllegalArgumentException_whenOtpCodeIsNull() {
        assertThatThrownBy(() -> passwordChangeEmailSender.send("to@test.com", null))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("otpCode가 blank이면 IllegalArgumentException을 던진다")
    void send_throwIllegalArgumentException_whenOtpCodeIsBlank() {
        assertThatThrownBy(() -> passwordChangeEmailSender.send("to@test.com", "  "))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
