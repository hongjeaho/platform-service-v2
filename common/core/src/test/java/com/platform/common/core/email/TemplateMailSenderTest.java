package com.platform.common.core.email;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.platform.common.core.config.EmailConfig;
import com.platform.common.core.config.properties.EmailProperties;
import jakarta.mail.BodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

/**
 * 템플릿 메일 kernel 테스트 — mock JavaMailSender + 실제 emailTemplateEngine +
 * 테스트 전용 템플릿(test-greeting.html). 도메인 템플릿에 의존하지 않는다(ADR-0005).
 */
@ExtendWith(MockitoExtension.class)
class TemplateMailSenderTest {

    @Mock
    private JavaMailSender mailSender;

    private TemplateMailSender templateMailSender;

    @BeforeEach
    void setUp() {
        var emailProperties = new EmailProperties("noreply@platform.com", "Platform");
        templateMailSender = new TemplateMailSender(
            mailSender,
            new EmailConfig().emailTemplateEngine(),
            emailProperties
        );
    }

    @Test
    @DisplayName("모델이 렌더된 템플릿 본문과 제목·발신자·수신자가 MIME 메시지에 실려 발송된다")
    void rendersTemplateIntoMimeAndSends() throws Exception {
        var mimeMessage = new MimeMessage((jakarta.mail.Session) null);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        templateMailSender.send(
            "user@example.com", "환영 인사", "test-greeting", Map.of("name", "홍재호"));

        verify(mailSender).send(mimeMessage);
        assertThat(mimeMessage.getSubject()).isEqualTo("환영 인사");
        assertThat(mimeMessage.getFrom()[0].toString()).contains("noreply@platform.com");
        assertThat(mimeMessage.getAllRecipients()[0].toString()).isEqualTo("user@example.com");
        assertThat(extractHtml(mimeMessage)).contains("홍재호");
    }

    @Test
    @DisplayName("수신자·제목·템플릿명이 blank면 IllegalArgumentException을 던진다")
    void rejectsBlankArguments() {
        org.assertj.core.api.Assertions.assertThatThrownBy(
                () -> templateMailSender.send(" ", "제목", "test-greeting", Map.of()))
            .isInstanceOf(IllegalArgumentException.class);
        org.assertj.core.api.Assertions.assertThatThrownBy(
                () -> templateMailSender.send("user@example.com", " ", "test-greeting", Map.of()))
            .isInstanceOf(IllegalArgumentException.class);
        org.assertj.core.api.Assertions.assertThatThrownBy(
                () -> templateMailSender.send("user@example.com", "제목", " ", Map.of()))
            .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("발송 실패는 EmailSendException으로 래핑된다")
    void wrapsSendFailure() {
        var mimeMessage = new MimeMessage((jakarta.mail.Session) null);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        org.mockito.Mockito.doThrow(new org.springframework.mail.MailSendException("smtp down"))
            .when(mailSender).send(mimeMessage);

        org.assertj.core.api.Assertions.assertThatThrownBy(
                () -> templateMailSender.send(
                    "user@example.com", "제목", "test-greeting", Map.of("name", "홍재호")))
            .isInstanceOf(EmailSendException.class);
    }

    /** multipart MIME에서 HTML 본문을 재귀적으로 추출한다. */
    private static String extractHtml(MimeMessage message) throws Exception {
        message.saveChanges();
        return extractText(message.getContent());
    }

    private static String extractText(Object content) throws Exception {
        if (content instanceof String text) {
            return text;
        }
        if (content instanceof MimeMultipart multipart) {
            var builder = new StringBuilder();
            for (int i = 0; i < multipart.getCount(); i++) {
                BodyPart part = multipart.getBodyPart(i);
                builder.append(extractText(part.getContent()));
            }
            return builder.toString();
        }
        return "";
    }
}
