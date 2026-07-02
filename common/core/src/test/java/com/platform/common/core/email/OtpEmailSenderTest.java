package com.platform.common.core.email;

import com.platform.common.core.config.properties.EmailProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.ui.context.Theme;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("OtpEmailSender 단위 테스트")
class OtpEmailSenderTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private SpringTemplateEngine templateEngine;

    private EmailProperties emailProperties;

    private OtpEmailSender otpEmailSender;

    @BeforeEach
    void setUp() {
        emailProperties = new EmailProperties("noreply@platform.com", "Platform");
        otpEmailSender = new OtpEmailSender(mailSender, templateEngine, emailProperties);
    }

    @Nested
    @DisplayName("정상 흐름 테스트")
    class NormalFlowTests {

        @Test
        @DisplayName("OtpTemplate.SIGNUP이 주어질 때 'signup-verification' 템플릿이 사용된다")
        void send_usesSignupVerificationTemplate_whenSIGNUP_given() throws MessagingException {
            // Given
            MimeMessage mimeMessage = mock(MimeMessage.class);
            when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
            when(templateEngine.process(eq("signup-verification"), any(Context.class)))
                    .thenReturn("<html>Signup OTP: 123456</html>");

            // When
            otpEmailSender.send("user@example.com", "123456", OtpTemplate.SIGNUP);

            // Then
            verify(templateEngine).process(eq("signup-verification"), any(Context.class));
            verify(mailSender).send(any(MimeMessage.class));
        }

        @Test
        @DisplayName("OtpTemplate.PASSWORD_CHANGE가 주어질 때 'password-change-verification' 템플릿이 사용된다")
        void send_usesPasswordChangeVerificationTemplate_whenPASSWORD_CHANGE_given() throws MessagingException {
            // Given
            MimeMessage mimeMessage = mock(MimeMessage.class);
            when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
            when(templateEngine.process(eq("password-change-verification"), any(Context.class)))
                    .thenReturn("<html>Password Change OTP: 654321</html>");

            // When
            otpEmailSender.send("user@example.com", "654321", OtpTemplate.PASSWORD_CHANGE);

            // Then
            verify(templateEngine).process(eq("password-change-verification"), any(Context.class));
            verify(mailSender).send(any(MimeMessage.class));
        }

        @Test
        @DisplayName("유효한 이메일, OTP 코드, 템플릿으로 이메일이 발송된다")
        void send_sendsEmail_withValidParameters() throws MessagingException {
            // Given
            MimeMessage mimeMessage = mock(MimeMessage.class);
            when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
            when(templateEngine.process(anyString(), any(Context.class)))
                    .thenReturn("<html>OTP: 123456</html>");

            // When
            otpEmailSender.send("test@example.com", "123456", OtpTemplate.SIGNUP);

            // Then
            verify(mailSender, times(1)).send(any(MimeMessage.class));
        }
    }

    @Nested
    @DisplayName("예외 상황 테스트")
    class ExceptionTests {

        @Test
        @DisplayName("수신자 이메일이 null이면 IllegalArgumentException을 발생시킨다")
        void send_throwsIllegalArgumentException_whenToIsNull() {
            // When & Then
            assertThatThrownBy(() -> otpEmailSender.send(null, "123456", OtpTemplate.SIGNUP))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("수신자 이메일은 필수입니다");
        }

        @Test
        @DisplayName("수신자 이메일이 blank이면 IllegalArgumentException을 발생시킨다")
        void send_throwsIllegalArgumentException_whenToIsBlank() {
            // When & Then
            assertThatThrownBy(() -> otpEmailSender.send("   ", "123456", OtpTemplate.SIGNUP))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("수신자 이메일은 필수입니다");
        }

        @Test
        @DisplayName("OTP 코드가 null이면 IllegalArgumentException을 발생시킨다")
        void send_throwsIllegalArgumentException_whenOtpCodeIsNull() {
            // When & Then
            assertThatThrownBy(() -> otpEmailSender.send("user@example.com", null, OtpTemplate.SIGNUP))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("OTP 코드는 필수입니다");
        }

        @Test
        @DisplayName("OTP 코드가 blank이면 IllegalArgumentException을 발생시킨다")
        void send_throwsIllegalArgumentException_whenOtpCodeIsBlank() {
            // When & Then
            assertThatThrownBy(() -> otpEmailSender.send("user@example.com", "   ", OtpTemplate.SIGNUP))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("OTP 코드는 필수입니다");
        }

        @Test
        @DisplayName("MessagingException 발생 시 EmailSendException을 래핑하여 발생시킨다")
        void send_throwsEmailSendException_whenMessagingExceptionOccurs() throws MessagingException {
            // Given
            MimeMessage mimeMessage = mock(MimeMessage.class);
            when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
            when(templateEngine.process(anyString(), any(Context.class)))
                    .thenReturn("<html>OTP: 123456</html>");
            doThrow(new MailSendException("SMTP connection failed"))
                    .when(mailSender).send(any(MimeMessage.class));

            // When & Then
            assertThatThrownBy(() -> otpEmailSender.send("user@example.com", "123456", OtpTemplate.SIGNUP))
                    .isInstanceOf(EmailSendException.class)
                    .hasCauseInstanceOf(MailSendException.class);
        }
    }
}
