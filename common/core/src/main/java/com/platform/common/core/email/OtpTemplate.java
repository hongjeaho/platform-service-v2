package com.platform.common.core.email;

import lombok.Getter;

/**
 * OTP 이메일 템플릿 타입을 구분하는 enum
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
