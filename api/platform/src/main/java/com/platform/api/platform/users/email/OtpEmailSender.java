package com.platform.api.platform.users.email;

import com.platform.common.core.email.TemplateMailSender;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * OTP 인증 메일의 도메인 adapter — 제목·템플릿 매핑·{@code @Async} 정책을 소유하고,
 * 발송 기계는 {@link TemplateMailSender} kernel에 위임한다(ADR-0005).
 */
@Service
@RequiredArgsConstructor
public class OtpEmailSender {

    private final TemplateMailSender templateMailSender;

    /**
     * OTP 인증 이메일을 비동기로 발송한다.
     *
     * @param to       수신자 이메일 주소
     * @param otpCode  OTP 인증 코드
     * @param template 용도별 템플릿 (SIGNUP·PASSWORD_CHANGE)
     * @throws IllegalArgumentException otpCode가 null/blank인 경우
     */
    @Async
    public void send(String to, String otpCode, OtpTemplate template) {
        if (otpCode == null || otpCode.isBlank()) {
            throw new IllegalArgumentException("OTP 코드는 필수입니다.");
        }
        templateMailSender.send(to, "인증 코드", template.getTemplateName(), Map.of("otpCode", otpCode));
    }
}
