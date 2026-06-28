package com.platform.api.platform.users.controller;

import com.platform.api.platform.users.dto.ChangePasswordResponse;
import com.platform.api.platform.users.service.UsersService;
import com.platform.common.core.auth.AuthUser;
import com.platform.common.web.config.filter.JWTCheckFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.filter.OncePerRequestFilter;

import java.util.HashSet;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UsersController.class)
@AutoConfigureMockMvc(addFilters = false)
class UsersControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UsersService usersService;

    @MockitoBean
    private JWTCheckFilter jwtCheckFilter;

    @MockitoBean(name = "platformHeaderFilter")
    private OncePerRequestFilter platformHeaderFilter;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // SecurityContext 설정 (UserAccountHolder.getSeqNo()가 동작하도록)
        Set<com.platform.common.core.auth.BasicAuthority> authorities = new HashSet<>();
        authorities.add(com.platform.common.core.auth.BasicAuthority.builder()
            .userSeq(1L)
            .role("USER")
            .build());

        AuthUser authUser = AuthUser.builder()
            .seq(1L)
            .userId("testuser")
            .userEmail("test@example.com")
            .name("테스트 사용자")
            .roles(authorities)
            .build();

        UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(authUser, null, authUser.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Test
    @DisplayName("유효한 요청 시 200 OK와 success=true를 반환한다")
    void changePassword_return200WithSuccessTrue_whenValidRequest() throws Exception {
        // Given
        ChangePasswordResponse response = ChangePasswordResponse.success();
        when(usersService.changePassword(any(), any(), any())).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/users/change-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"currentPassword\":\"current123\",\"newPassword\":\"new12345\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.success").value(true))
            .andExpect(jsonPath("$.data.message").value("비밀번호가 변경되었습니다."));
    }

    @Test
    @DisplayName("올바르지 않은 currentPassword로 요청 시 400 Bad Request를 반환한다")
    void changePassword_return400_whenCurrentPasswordIsIncorrect() throws Exception {
        // Given
        when(usersService.changePassword(any(), any(), any()))
            .thenThrow(new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다."));

        // When & Then
        mockMvc.perform(post("/api/users/change-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"currentPassword\":\"wrongPassword\",\"newPassword\":\"new12345\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("newPassword가 currentPassword와 동일하면 409 Conflict를 반환한다")
    void changePassword_return409_whenNewPasswordEqualsCurrentPassword() throws Exception {
        // Given
        when(usersService.changePassword(any(), any(), any()))
            .thenThrow(new IllegalStateException("현재 비밀번호와 동일합니다."));

        // When & Then
        mockMvc.perform(post("/api/users/change-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"currentPassword\":\"current123\",\"newPassword\":\"current123\"}"))
            .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("8자 미만 newPassword로 요청 시 400 Bad Request를 반환한다 (Bean Validation)")
    void changePassword_return400_whenNewPasswordLessThan8Chars() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/users/change-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"currentPassword\":\"current123\",\"newPassword\":\"new123\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("12자 초과 newPassword로 요청 시 400 Bad Request를 반환한다 (Bean Validation)")
    void changePassword_return400_whenNewPasswordExceeds12Chars() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/users/change-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"currentPassword\":\"current123\",\"newPassword\":\"new123456789012\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("빈 currentPassword로 요청 시 400 Bad Request를 반환한다 (Bean Validation)")
    void changePassword_return400_whenCurrentPasswordIsEmpty() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/users/change-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"currentPassword\":\"\",\"newPassword\":\"new12345\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("빈 newPassword로 요청 시 400 Bad Request를 반환한다 (Bean Validation)")
    void changePassword_return400_whenNewPasswordIsEmpty() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/users/change-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"currentPassword\":\"current123\",\"newPassword\":\"\"}"))
            .andExpect(status().isBadRequest());
    }
}
