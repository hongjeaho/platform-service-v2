package com.platform.api.platform.users.email;

import static org.assertj.core.api.Assertions.assertThat;

import com.platform.common.core.config.EmailConfig;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

/**
 * 도메인 메일 템플릿의 실렌더 검증 — 템플릿 파일 누락 계열 버그의 상시 방지선(ADR-0005).
 *
 * <p>실제 {@code emailTemplateEngine} 설정으로 렌더한다. 엔진을 mock하면
 * "존재하지 않는 템플릿 이름"이 테스트를 통과해버린다(signup-verification 버그의 원인).
 */
class EmailTemplateRenderingTest {

    private final SpringTemplateEngine engine = new EmailConfig().emailTemplateEngine();

    @Test
    @DisplayName("signup-verification 템플릿이 OTP 코드를 렌더한다")
    void rendersSignupVerification() {
        var html = render("signup-verification", Map.of("otpCode", "123456"));

        assertThat(html).contains("123456");
    }

    @Test
    @DisplayName("password-change-verification 템플릿이 OTP 코드를 렌더한다")
    void rendersPasswordChangeVerification() {
        var html = render("password-change-verification", Map.of("otpCode", "654321"));

        assertThat(html).contains("654321");
    }

    @Test
    @DisplayName("welcome 템플릿이 사용자 이름을 렌더한다")
    void rendersWelcome() {
        var html = render("welcome", Map.of("userName", "홍재호"));

        assertThat(html).contains("홍재호");
    }

    private String render(String templateName, Map<String, Object> model) {
        var context = new Context();
        model.forEach(context::setVariable);
        return engine.process(templateName, context);
    }
}
