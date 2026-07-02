package com.platform.common.core.email;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("OtpTemplate Enum 테스트")
class OtpTemplateTest {

    @Test
    @DisplayName("OtpTemplate.SIGNUP은 'signup-verification' 템플릿 이름을 반환한다")
    void SIGNUP_returnsSignupTemplateName() {
        // When
        String templateName = OtpTemplate.SIGNUP.getTemplateName();

        // Then
        assertThat(templateName).isEqualTo("signup-verification");
    }

    @Test
    @DisplayName("OtpTemplate.PASSWORD_CHANGE는 'password-change-verification' 템플릿 이름을 반환한다")
    void PASSWORD_CHANGE_returnsPasswordChangeTemplateName() {
        // When
        String templateName = OtpTemplate.PASSWORD_CHANGE.getTemplateName();

        // Then
        assertThat(templateName).isEqualTo("password-change-verification");
    }

    @Test
    @DisplayName("모든 OtpTemplate enum 값이 존재해야 한다")
    void allValuesExist() {
        // When
        OtpTemplate[] values = OtpTemplate.values();

        // Then
        assertThat(values).hasSize(2);
        assertThat(values).containsExactly(OtpTemplate.SIGNUP, OtpTemplate.PASSWORD_CHANGE);
    }
}
