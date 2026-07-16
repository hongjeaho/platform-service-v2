package com.platform.api.platform.config;

import com.platform.api.platform.auth.AuthUser;
import com.platform.api.platform.auth.BasicAuthority;
import com.platform.common.core.jwt.JwtSessionManager;
import java.util.Set;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * local 프로필의 Swagger UI 편의 토큰 — 회원 도메인 principal을 조립하므로
 * common이 아닌 도메인 쪽이 소유한다(ADR-0004). {@code PlatformLocalHeaderFilter}가
 * 이 bean을 이름으로 주입받아 Swagger 요청에 Authorization 헤더를 자동 부착한다.
 */
@Profile("local")
@Configuration
public class SwaggerTokenConfig {

    @Bean
    public String createSwaggerJwtToken(JwtSessionManager jwtSessionManager) {
        AuthUser authUser = AuthUser.builder()
            .seq(1L)
            .userId("admin")
            .roles(Set.of(
                BasicAuthority.builder().userSeq(1L).role("ADMIN").build(),
                BasicAuthority.builder().userSeq(1L).role("USER").build()
            ))
            .build();
        return "Bearer " + jwtSessionManager.issue(authUser);
    }
}
