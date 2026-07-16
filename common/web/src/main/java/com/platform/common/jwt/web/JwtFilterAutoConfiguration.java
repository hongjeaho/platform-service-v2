package com.platform.common.jwt.web;

import com.platform.common.core.jwt.JwtSessionManager;
import com.platform.common.jwt.JwtSessionAutoConfiguration;
import com.platform.common.web.config.filter.JWTCheckFilter;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.Bean;

/**
 * JWT 인증 필터의 조건부 활성화(ADR-0004) — kernel({@link JwtSessionManager})이
 * 활성화된 시스템에서만 서블릿 adapter를 등록한다.
 */
@AutoConfiguration(after = JwtSessionAutoConfiguration.class)
@ConditionalOnBean(JwtSessionManager.class)
public class JwtFilterAutoConfiguration {

    @Bean
    public JWTCheckFilter jwtCheckFilter(JwtSessionManager jwtSessionManager) {
        return new JWTCheckFilter(jwtSessionManager);
    }
}
