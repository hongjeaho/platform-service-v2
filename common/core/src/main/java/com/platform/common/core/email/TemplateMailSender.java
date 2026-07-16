package com.platform.common.core.email;

import com.platform.common.core.config.properties.EmailProperties;
import jakarta.mail.internet.InternetAddress;
import java.util.Map;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

/**
 * 템플릿 메일 kernel — "템플릿 이름 + 모델 → 발송" 하나의 interface 뒤에
 * MIME 조립·발신자·UTF-8 제목·Thymeleaf 렌더·예외 래핑을 숨긴다(ADR-0005).
 *
 * <p><b>동기(synchronous)</b> 발송이다 — 비동기({@code @Async})·제목 문구·템플릿 파일은
 * 호출하는 도메인이 소유한다. 메일 문구는 도메인 언어다.
 */
@Service
public class TemplateMailSender {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    private final EmailProperties emailProperties;

    public TemplateMailSender(JavaMailSender mailSender,
                              @Qualifier("emailTemplateEngine") SpringTemplateEngine templateEngine,
                              EmailProperties emailProperties) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.emailProperties = emailProperties;
    }

    /**
     * 템플릿을 모델로 렌더하여 HTML 메일을 발송한다.
     *
     * @param to           수신자 이메일 주소
     * @param subject      메일 제목
     * @param templateName {@code classpath:/templates/email/} 하위 템플릿 이름(확장자 제외)
     * @param model        템플릿 변수
     * @throws IllegalArgumentException to·subject·templateName이 null/blank인 경우
     * @throws EmailSendException       렌더 또는 발송 실패 시
     */
    public void send(String to, String subject, String templateName, Map<String, Object> model) {
        requireText(to, "수신자 이메일은 필수입니다.");
        requireText(subject, "메일 제목은 필수입니다.");
        requireText(templateName, "템플릿 이름은 필수입니다.");

        try {
            var message = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(new InternetAddress(emailProperties.from(), emailProperties.fromName()));
            helper.setTo(to);
            // MimeMessageHelper.setSubject()는 MimeUtility.encodeText()를 거쳐 한글을 인코딩하므로
            // setSubject(String, String)을 직접 호출해 원본 문자열을 유지한다
            message.setSubject(subject, "UTF-8");

            var context = new Context();
            model.forEach(context::setVariable);
            helper.setText(templateEngine.process(templateName, context), true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new EmailSendException("이메일 발송에 실패했습니다.", e);
        }
    }

    private static void requireText(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }
    }
}
