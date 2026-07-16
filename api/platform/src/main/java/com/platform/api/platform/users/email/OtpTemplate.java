package com.platform.api.platform.users.email;

import lombok.Getter;

/**
 * OTP 이메일 템플릿 타입 — 회원 도메인이 소유하는 presentation(ADR-0005, ADR-0001 5항 대체).
 * 템플릿 파일은 {@code api/platform/src/main/resources/templates/email/}에 함께 산다.
 */
@Getter
public enum OtpTemplate {
    SIGNUP("signup-verification"),           // 회원 가입용
    PASSWORD_CHANGE("password-change-verification");  // 비밀번호 변경용

    private final String templateName;

    OtpTemplate(String templateName) {
        this.templateName = templateName;
    }
}
