package com.platform.common.core.email;

import com.platform.common.core.email.config.EmailProperties;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.UnsupportedEncodingException;

/**
 * 회원가입 축하 이메일 발송 서비스.
 */
@Service
public class WelcomeEmailSender implements EmailSender {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    private final EmailProperties emailProperties;

    public WelcomeEmailSender(JavaMailSender mailSender,
                              @Qualifier("emailTemplateEngine") SpringTemplateEngine templateEngine,
                              EmailProperties emailProperties) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.emailProperties = emailProperties;
    }

    /**
     * 회원가입 축하 이메일을 발송한다.
     *
     * @param to       수신자 이메일 주소
     * @param userName 수신자 이름
     * @throws IllegalArgumentException to 또는 userName이 null/blank인 경우
     */
    public void send(String to, String userName) {
        if (to == null || to.isBlank()) {
            throw new IllegalArgumentException("수신자 이메일은 필수입니다.");
        }
        if (userName == null || userName.isBlank()) {
            throw new IllegalArgumentException("사용자명은 필수입니다.");
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(new InternetAddress(emailProperties.from(), emailProperties.fromName()));
            helper.setTo(to);
            // MimeMessageHelper.setSubject()는 MimeUtility.encodeText()를 거쳐 한글을 인코딩하므로
            // setSubject(String, String)을 직접 호출해 원본 문자열을 유지한다
            message.setSubject("가입을 축하합니다!", "UTF-8");

            Context context = new Context();
            context.setVariable("userName", userName);
            String html = templateEngine.process("email/welcome", context);
            helper.setText(html, true);

            mailSender.send(message);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new EmailSendException("이메일 발송에 실패했습니다.", e);
        }
    }
}
