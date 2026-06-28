package com.platform.common.core.email;

import com.platform.common.core.email.config.EmailProperties;
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
class WelcomeEmailSenderTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private SpringTemplateEngine templateEngine;

    private MimeMessage mimeMessage;
    private WelcomeEmailSender welcomeEmailSender;

    @BeforeEach
    void setUp() {
        mimeMessage = mock(MimeMessage.class);
        EmailProperties emailProperties = new EmailProperties("noreply@test.com", "Platform");
        welcomeEmailSender = new WelcomeEmailSender(mailSender, templateEngine, emailProperties);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any())).thenReturn("<html><body>홍길동</body></html>");
    }

    @Test
    @DisplayName("유효한 to와 userName이 주어지면 mailSender.send(MimeMessage)를 1회 호출한다")
    void send_invokeMailSenderOnce_whenValidToAndUserNameGiven() {
        // When
        welcomeEmailSender.send("to@test.com", "홍길동");

        // Then — Red: skeleton이 아무것도 하지 않아 verify 실패
        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("유효한 to와 userName이 주어지면 MimeMessage subject에 '가입을 축하합니다!'를 포함한다")
    void send_setSubjectContainingWelcome_whenValidGiven() throws Exception {
        // When
        welcomeEmailSender.send("to@test.com", "홍길동");

        // Then — Red: mailSender.send 미호출 → verify 실패
        verify(mailSender).send(any(MimeMessage.class));
        // Green: MimeMessageHelper.setSubject("가입을 축하합니다!") 호출 검증
        verify(mimeMessage).setSubject(contains("가입을 축하합니다!"), anyString());
    }

    @Test
    @DisplayName("Thymeleaf 템플릿 처리 시 context에 userName이 포함된다")
    void send_renderUserNameInBody_whenThymeleafTemplateProcessed() {
        // When
        welcomeEmailSender.send("to@test.com", "홍길동");

        // Then — Red: templateEngine.process 미호출 → verify 실패
        ArgumentCaptor<IContext> contextCaptor = ArgumentCaptor.forClass(IContext.class);
        verify(templateEngine).process(anyString(), contextCaptor.capture());
        assertThat(contextCaptor.getValue().getVariable("userName")).isEqualTo("홍길동");
    }

    @Test
    @DisplayName("to가 null이면 IllegalArgumentException을 던진다")
    void send_throwIllegalArgumentException_whenToIsNull() {
        assertThatThrownBy(() -> welcomeEmailSender.send(null, "홍길동"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("to가 blank이면 IllegalArgumentException을 던진다")
    void send_throwIllegalArgumentException_whenToIsBlank() {
        assertThatThrownBy(() -> welcomeEmailSender.send("   ", "홍길동"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("userName이 null이면 IllegalArgumentException을 던진다")
    void send_throwIllegalArgumentException_whenUserNameIsNull() {
        assertThatThrownBy(() -> welcomeEmailSender.send("to@test.com", null))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("userName이 blank이면 IllegalArgumentException을 던진다")
    void send_throwIllegalArgumentException_whenUserNameIsBlank() {
        assertThatThrownBy(() -> welcomeEmailSender.send("to@test.com", "  "))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
