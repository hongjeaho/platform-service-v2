package com.platform.api.platform.users.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.api.platform.users.dto.SendOtpResponse;
import com.platform.api.platform.users.service.UsersService;
import com.platform.api.platform.users.type.OtpPurpose;
import com.platform.common.web.config.filter.JWTCheckFilter;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.filter.OncePerRequestFilter;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PublicOtpsController.class)
@AutoConfigureMockMvc(addFilters = false)
class PublicOtpsControllerTest {

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

    @Test
    @DisplayName("purpose가 SIGNUP이면 sendSignupOtp로 위임하고 200을 반환한다")
    void issueOtp_delegateToSendSignupOtp_whenPurposeIsSignup() throws Exception {
        // Given
        when(usersService.sendSignupOtp(eq("newuser@example.com")))
            .thenReturn(SendOtpResponse.ofSuccess());

        // When & Then
        mockMvc.perform(post("/api/public/otps")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userEmail\":\"newuser@example.com\",\"purpose\":\"" + OtpPurpose.SIGNUP + "\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.message").value("OTP가 이메일로 발송되었습니다."));
    }

    @Test
    @DisplayName("purpose가 PASSWORD_CHANGE이면 sendPasswordChangeOtp로 위임하고 200을 반환한다")
    void issueOtp_delegateToSendPasswordChangeOtp_whenPurposeIsPasswordChange() throws Exception {
        // Given
        when(usersService.sendPasswordChangeOtp(eq("test@example.com")))
            .thenReturn(SendOtpResponse.ofSuccess());

        // When & Then
        mockMvc.perform(post("/api/public/otps")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userEmail\":\"test@example.com\",\"purpose\":\"" + OtpPurpose.PASSWORD_CHANGE + "\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.message").value("OTP가 이메일로 발송되었습니다."));
    }

    @Test
    @DisplayName("SIGNUP 발송 시 이미 가입된 이메일이면 409를 반환한다")
    void issueOtp_return409_whenSignupEmailAlreadyRegistered() throws Exception {
        // Given
        when(usersService.sendSignupOtp(eq("existing@example.com")))
            .thenThrow(new IllegalStateException("이미 가입된 이메일입니다."));

        // When & Then
        mockMvc.perform(post("/api/public/otps")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userEmail\":\"existing@example.com\",\"purpose\":\"" + OtpPurpose.SIGNUP + "\"}"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.error.message").value("이미 가입된 이메일입니다."));
    }

    @Test
    @DisplayName("PASSWORD_CHANGE 발송 시 미등록 이메일이면 400을 반환한다")
    void issueOtp_return400_whenPasswordChangeEmailNotRegistered() throws Exception {
        // Given
        when(usersService.sendPasswordChangeOtp(eq("unregistered@example.com")))
            .thenThrow(new IllegalArgumentException("해당 이메일로 등록된 사용자가 없습니다."));

        // When & Then
        mockMvc.perform(post("/api/public/otps")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userEmail\":\"unregistered@example.com\",\"purpose\":\"" + OtpPurpose.PASSWORD_CHANGE + "\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error.message").value("해당 이메일로 등록된 사용자가 없습니다."));
    }

    @Test
    @DisplayName("purpose가 누락되면 400을 반환한다 (Bean Validation)")
    void issueOtp_return400_whenPurposeMissing() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/public/otps")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userEmail\":\"test@example.com\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("userEmail이 빈 값이면 400을 반환한다 (Bean Validation)")
    void issueOtp_return400_whenUserEmailBlank() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/public/otps")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userEmail\":\"\",\"purpose\":\"" + OtpPurpose.SIGNUP + "\"}"))
            .andExpect(status().isBadRequest());
    }
}
