package com.platform.common.core.email;

import com.platform.common.core.config.properties.EmailProperties;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.UnsupportedEncodingException;

/**
 * OTP 인증 이메일 발송 서비스 (통합 템플릿 처리)
 */
@Service
public class OtpEmailSender implements EmailSender {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    private final EmailProperties emailProperties;

    public OtpEmailSender(JavaMailSender mailSender,
                          @Qualifier("emailTemplateEngine") SpringTemplateEngine templateEngine,
                          EmailProperties emailProperties) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.emailProperties = emailProperties;
    }

    /**
     * OTP 인증 이메일을 발송한다. OtpTemplate에 따라 템플릿을 동적으로 선택한다.
     *
     * @param to      수신자 이메일 주소
     * @param otpCode OTP 인증 코드
     * @param template 템플릿 타입 (SIGNUP or PASSWORD_CHANGE)
     * @throws IllegalArgumentException to 또는 otpCode가 null/blank인 경우
     * @throws EmailSendException 이메일 발송 실패(MessagingException) 시
     */
    @Async
    public void send(String to, String otpCode, OtpTemplate template) {
        if (to == null || to.isBlank()) {
            throw new IllegalArgumentException("수신자 이메일은 필수입니다.");
        }
        if (otpCode == null || otpCode.isBlank()) {
            throw new IllegalArgumentException("OTP 코드는 필수입니다.");
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(new InternetAddress(emailProperties.from(), emailProperties.fromName()));
            helper.setTo(to);
            message.setSubject("인증 코드", "UTF-8");

            Context context = new Context();
            context.setVariable("otpCode", otpCode);
            String html = templateEngine.process(template.getTemplateName(), context);
            helper.setText(html, true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new EmailSendException("이메일 발송에 실패했습니다.", e);
        }
    }
}
