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
class WelcomeEmailSenderTest {

    @Mock
    private TemplateMailSender templateMailSender;

    @InjectMocks
    private WelcomeEmailSender welcomeEmailSender;

    @Test
    @DisplayName("'가입을 축하합니다!' 제목과 welcome 템플릿으로 발송한다")
    void sendsWelcomeMail() {
        welcomeEmailSender.send("user@example.com", "홍재호");

        verify(templateMailSender).send(
            "user@example.com", "가입을 축하합니다!", "welcome", Map.of("userName", "홍재호"));
    }

    @Test
    @DisplayName("사용자명이 blank면 IllegalArgumentException을 던진다")
    void rejectsBlankUserName() {
        assertThatThrownBy(() -> welcomeEmailSender.send("user@example.com", " "))
            .isInstanceOf(IllegalArgumentException.class);
    }
}
