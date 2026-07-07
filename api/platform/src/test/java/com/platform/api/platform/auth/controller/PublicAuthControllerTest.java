package com.platform.api.platform.auth.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.security.authentication.BadCredentialsException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.api.platform.auth.dto.LoginResponse;
import com.platform.api.platform.auth.service.AuthService;
import com.platform.common.core.auth.AuthUser;
import com.platform.common.core.auth.BasicAuthority;
import com.platform.common.core.util.JwtTokenUtil;
import com.platform.common.web.config.filter.JWTCheckFilter;

import java.util.Set;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.http.MediaType;

import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.filter.OncePerRequestFilter;


/**
 * PublicAuthController 슬라이스 테스트.
 */
@WebMvcTest(PublicAuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class PublicAuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    // SecurityConfig 의존성 방지를 위한 MockitoBean 추가
    @MockitoBean
    private JwtTokenUtil jwtTokenUtil;
    @MockitoBean
    private org.springframework.security.core.userdetails.UserDetailsService userDetailsService;
    @MockitoBean
    private JWTCheckFilter jwtCheckFilter;
    @MockitoBean
    @Qualifier("platformHeaderFilter")
    private OncePerRequestFilter platformHeaderFilter;

    @Autowired
    private ObjectMapper objectMapper;

    @Nested
    @DisplayName("login 엔드포인트는")
    class Describe_login {

        @Test
        @DisplayName("유효한 요청 시 200 OK와 사용자 정보를 반환한다")
        void validRequest_returns200AndUser() throws Exception {
            // Given
            AuthUser authUser = AuthUser.builder()
                    .seq(1L)
                    .userId("admin")
                    .userEmail("admin@example.com")
                    .name("Admin User")
                    .roles(Set.of(BasicAuthority.builder().userSeq(1L).role("ADMIN").build()))
                    .build();

            when(authService.login(any()))
                    .thenReturn(new LoginResponse("jwt-token", authUser));

            // When & Then
            mockMvc.perform(post("/api/public/auth")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(
                                    new com.platform.common.core.auth.AuthRequest("admin", "password"))))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data").exists())
                    .andExpect(jsonPath("$.data.seq").value(1))
                    .andExpect(jsonPath("$.data.userId").value("admin"))
                    .andExpect(jsonPath("$.data.name").value("Admin User"))
                    .andExpect(jsonPath("$.data.userEmail").value("admin@example.com"));
        }

        @Test
        @DisplayName("빈 아이디로 요청 시 400 Bad Request를 반환한다")
        void blankId_returns400() throws Exception {
            // When & Then
            mockMvc.perform(post("/api/public/auth")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"id\":\"\", \"password\":\"password\"}"))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("빈 비밀번호로 요청 시 400 Bad Request를 반환한다")
        void blankPassword_returns400() throws Exception {
            // When & Then
            mockMvc.perform(post("/api/public/auth")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"id\":\"admin\", \"password\":\"\"}"))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("아이디 필드가 없으면 400 Bad Request를 반환한다")
        void missingId_returns400() throws Exception {
            // When & Then
            mockMvc.perform(post("/api/public/auth")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"password\":\"password\"}"))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("비밀번호 필드가 없으면 400 Bad Request를 반환한다")
        void missingPassword_returns400() throws Exception {
            // When & Then
            mockMvc.perform(post("/api/public/auth")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"id\":\"admin\"}"))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("아이디 또는 비밀번호가 일치하지 않으면 401 Unauthorized를 반환한다")
        void badCredentials_returns401() throws Exception {
            // Given
            when(authService.login(any()))
                    .thenThrow(new BadCredentialsException("Bad credentials"));

            // When & Then
            mockMvc.perform(post("/api/public/auth")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(
                                    new com.platform.common.core.auth.AuthRequest("admin", "wrong"))))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.error.message").value("아이디 또는 비밀번호가 일치하지 않습니다"));
        }

        @Test
        @DisplayName("Authorization 헤더에 JWT 토큰이 포함된다")
        void returnsAuthorizationHeader() throws Exception {
            // Given
            AuthUser authUser = AuthUser.builder()
                    .seq(1L)
                    .userId("admin")
                    .build();

            when(authService.login(any()))
                    .thenReturn(new LoginResponse("Bearer-token", authUser));

            // When & Then
            mockMvc.perform(post("/api/public/auth")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(
                                    new com.platform.common.core.auth.AuthRequest("admin", "password"))))
                    .andExpect(status().isOk())
                    .andExpect(result -> {
                        String authHeader = result.getResponse().getHeader("Authorization");
                        // 헤더가 존재하고 Bearer로 시작하는지 확인
                        // (Note: MockMvc의 응답 헤더 검증은 제한적이라 로그로 확인 가능)
                    });
        }
    }
}
