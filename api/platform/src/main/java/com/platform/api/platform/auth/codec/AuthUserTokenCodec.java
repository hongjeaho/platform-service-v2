package com.platform.api.platform.auth.codec;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.api.platform.auth.AuthUser;
import com.platform.common.core.jwt.TokenUserCodec;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

/**
 * 회원 도메인의 {@link TokenUserCodec} adapter — {@link AuthUser}와 JWT claims 간 변환을 소유한다.
 *
 * <p>이 bean의 존재가 "이 시스템은 JWT 인증을 쓴다"는 선언이다(ADR-0004).
 * claim 스키마는 기존 토큰과의 호환을 위해 {@code JwtTokenUtil} 시절의 Jackson 직렬화
 * 형태(seq·userEmail·userId·name·roles, password 제외)를 그대로 재현한다.
 */
@Component
@RequiredArgsConstructor
public class AuthUserTokenCodec implements TokenUserCodec {

    private final ObjectMapper objectMapper;

    @Override
    public Map<String, Object> toClaims(UserDetails user) {
        return objectMapper.convertValue(user, new TypeReference<>() {
        });
    }

    @Override
    public UserDetails fromClaims(Map<String, Object> claims) {
        return objectMapper.convertValue(claims, AuthUser.class);
    }
}
