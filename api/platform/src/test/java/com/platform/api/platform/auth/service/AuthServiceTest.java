package com.platform.api.platform.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.platform.api.platform.auth.dto.AuthRequest;
import com.platform.api.platform.auth.AuthUser;
import com.platform.api.platform.auth.BasicAuthority;
import com.platform.common.core.jwt.JwtSessionManager;
import java.util.Set;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

/**
 * AuthService 단위 테스트.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtSessionManager jwtSessionManager;

    @InjectMocks
    private AuthService authService;

    @Nested
    @DisplayName("login 메서드는")
    class Describe_login {

        @Test
        @DisplayName("유효한 자격증명으로 인증에 성공하면 토큰과 사용자 정보를 반환한다")
        void success_returnsTokenAndUser() {
            // Given
            AuthRequest request = new AuthRequest("admin", "password");
            AuthUser authUser = AuthUser.builder()
                    .seq(1L)
                    .userId("admin")
                    .userEmail("admin@example.com")
                    .name("Admin")
                    .password("encoded")
                    .roles(Set.of(BasicAuthority.builder().userSeq(1L).role("ADMIN").build()))
                    .build();

            Authentication authentication = mock(Authentication.class);
            when(authentication.getPrincipal()).thenReturn(authUser);
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(authentication);
            when(jwtSessionManager.issue(any(AuthUser.class)))
                    .thenReturn("jwt-token");

            // When
            var result = authService.login(request);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.token()).isEqualTo("jwt-token");
            assertThat(result.user()).isNotNull();
            assertThat(result.user().getSeq()).isEqualTo(1L);
            assertThat(result.user().getUserId()).isEqualTo("admin");

            verify(authenticationManager).authenticate(any());
            verify(jwtSessionManager).issue(any(AuthUser.class));
        }

        @Test
        @DisplayName("인증 주체가 AuthUser 타입이 아니면 IllegalStateException을 던진다")
        void invalidPrincipal_throwsIllegalStateException() {
            // Given
            AuthRequest request = new AuthRequest("admin", "password");

            Authentication authentication = mock(Authentication.class);
            when(authentication.getPrincipal()).thenReturn("invalid-principal");
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(authentication);

            // When & Then
            assertThatThrownBy(() -> authService.login(request))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("인증 주체가 AuthUser 타입이 아닙니다");
        }

        @Test
        @DisplayName("자격증명이 유효하지 않으면 AuthenticationException을 던진다")
        void invalidCredentials_throwsAuthenticationException() {
            // Given
            AuthRequest request = new AuthRequest("invalid", "wrong-password");
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenThrow(new org.springframework.security.authentication.BadCredentialsException("Bad credentials"));

            // When & Then
            assertThatThrownBy(() -> authService.login(request))
                    .isInstanceOf(org.springframework.security.authentication.BadCredentialsException.class)
                    .hasMessageContaining("Bad credentials");
        }
    }
}
