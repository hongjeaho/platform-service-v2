package com.platform.api.platform.auth.service;

import com.platform.api.platform.auth.dto.LoginResponse;
import com.platform.common.core.authority.AuthRequest;
import com.platform.common.core.authority.AuthUser;
import com.platform.common.core.util.JwtTokenUtil;
import com.platform.datasource.platform.config.database.PlatformTransactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

/**
 * 인증 비즈니스 로직 서비스.
 *
 * <p>Spring Security {@link AuthenticationManager}를 통해 자격증명을 검증하고
 * JWT 토큰을 생성한다.
 */
@Service
@RequiredArgsConstructor
public class AuthService {
    @Value("${jwt.expiration.period:86400000}")
    private long jwtExpirationPeriod;

    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;

    /**
     * 아이디·비밀번호를 검증하고 JWT 토큰을 발급한다.
     *
     * @param authRequest 로그인 요청 정보
     * @return JWT 토큰과 인증된 사용자 정보
     * @throws org.springframework.security.core.AuthenticationException 자격증명이 유효하지 않을 때
     * @throws IllegalStateException 인증 주체가 {@link AuthUser} 타입이 아닐 때
     */
    @PlatformTransactional(readOnly = true)
    public LoginResponse login(AuthRequest authRequest) {
        final var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getId(),
                        authRequest.getPassword()));

        if (!(authentication.getPrincipal() instanceof AuthUser authUser)) {
            throw new IllegalStateException("인증 주체가 AuthUser 타입이 아닙니다.");
        }

        final var token = jwtTokenUtil.makeAuthToken(authUser, jwtExpirationPeriod);
        return new LoginResponse(token, authUser);
    }
}
