package com.platform.common.core.email;

import com.platform.common.core.email.config.EmailProperties;
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
 * 비밀번호 변경 OTP 인증 이메일 발송 서비스.
 */
@Service
public class PasswordChangeEmailSender implements EmailSender {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    private final EmailProperties emailProperties;

    public PasswordChangeEmailSender(JavaMailSender mailSender,
                                     @Qualifier("emailTemplateEngine") SpringTemplateEngine templateEngine,
                                     EmailProperties emailProperties) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.emailProperties = emailProperties;
    }

    /**
     * 비밀번호 변경 OTP 인증 이메일을 발송한다.
     *
     * @param to      수신자 이메일 주소
     * @param otpCode OTP 인증 코드
     * @throws IllegalArgumentException to 또는 otpCode가 null/blank인 경우
     */
    @Async
    public void send(String to, String otpCode) {
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
            message.setSubject("비밀번호 변경 인증 코드", "UTF-8");

            Context context = new Context();
            context.setVariable("otpCode", otpCode);
            String html = templateEngine.process("password-change-verification", context);
            helper.setText(html, true);

            mailSender.send(message);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new EmailSendException("이메일 발송에 실패했습니다.", e);
        }
    }
}
