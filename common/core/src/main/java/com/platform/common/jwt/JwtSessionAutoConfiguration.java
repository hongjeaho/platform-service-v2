package com.platform.common.jwt;

import com.platform.common.core.jwt.JwtSessionManager;
import com.platform.common.core.jwt.TokenUserCodec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.Bean;

/**
 * JWT 세션 kernel의 조건부 활성화(ADR-0004).
 *
 * <p>{@link TokenUserCodec} bean의 존재가 "이 시스템은 JWT 인증을 쓴다"는 선언이다 —
 * codec이 없는 시스템은 JWT 스택 없이 부팅된다. 컴포넌트 스캔 순서에 의존하지 않도록
 * auto-configuration으로 등록한다(스캔 루트 {@code com.platform.common.core} 밖 패키지).
 *
 * <p>{@code jwt.issuer}는 기본값 없는 필수 프로퍼티다 — 각 시스템이 자기 정체성을
 * 선언해야 인스턴스 간 토큰 교차 만족이 차단된다.
 */
@AutoConfiguration
@ConditionalOnBean(TokenUserCodec.class)
public class JwtSessionAutoConfiguration {

    @Bean
    public JwtSessionManager jwtSessionManager(
        @Value("${jwt.secret}") String secret,
        @Value("${jwt.issuer}") String issuer,
        @Value("${jwt.expiration.period:86400000}") long expirationPeriodMillis,
        @Value("${jwt.expiration.renew-before:3600000}") long renewBeforeMillis,
        TokenUserCodec codec
    ) {
        return new JwtSessionManager(secret, issuer, expirationPeriodMillis, renewBeforeMillis, codec);
    }
}
