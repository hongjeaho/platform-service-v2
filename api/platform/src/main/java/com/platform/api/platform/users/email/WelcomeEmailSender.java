package com.platform.api.platform.users.email;

import com.platform.common.core.email.TemplateMailSender;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * 가입 축하 메일의 도메인 adapter — 회원가입 완료 시 발송된다(ADR-0005).
 */
@Service
@RequiredArgsConstructor
public class WelcomeEmailSender {

    private final TemplateMailSender templateMailSender;

    /**
     * 가입 축하 이메일을 비동기로 발송한다.
     *
     * @param to       수신자 이메일 주소
     * @param userName 수신자 이름
     * @throws IllegalArgumentException userName이 null/blank인 경우
     */
    @Async
    public void send(String to, String userName) {
        if (userName == null || userName.isBlank()) {
            throw new IllegalArgumentException("사용자명은 필수입니다.");
        }
        templateMailSender.send(to, "가입을 축하합니다!", "welcome", Map.of("userName", userName));
    }
}
