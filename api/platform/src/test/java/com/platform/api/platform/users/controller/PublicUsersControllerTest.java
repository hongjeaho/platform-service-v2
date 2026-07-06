package com.platform.api.platform.users.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.api.platform.users.dto.ChangePasswordResponse;
import com.platform.api.platform.users.dto.CheckDuplicateResponse;
import com.platform.api.platform.users.dto.UsersSignupRequest;
import com.platform.api.platform.users.dto.UsersSignupResponse;
import com.platform.api.platform.users.service.UsersService;
import com.platform.common.web.config.filter.JWTCheckFilter;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.web.filter.OncePerRequestFilter;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PublicUsersController.class)
@AutoConfigureMockMvc(addFilters = false)
class PublicUsersControllerTest {

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

    private UsersSignupRequest validRequest;
    private UsersSignupResponse signupResponse;

    @BeforeEach
    void setUp() {
        validRequest = new UsersSignupRequest("testuser", "홍길동", "password123", "test@example.com", "123456");

        signupResponse = new UsersSignupResponse(1L, "testuser", "홍길동");
    }

    @Test
    @DisplayName("유효한 요청 시 201과 UsersSignupResponse를 반환한다")
    void signup_return201_whenValidRequest() throws Exception {
        // Given
        when(usersService.signup(any())).thenReturn(signupResponse);

        // When & Then
        mockMvc.perform(post("/api/public/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.seq").value(1L))
            .andExpect(jsonPath("$.data.userId").value("testuser"))
            .andExpect(jsonPath("$.data.userName").value("홍길동"));
    }

    @Test
    @DisplayName("userId가 없으면 400을 반환한다")
    void signup_return400_whenUserIdBlank() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/public/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userName\":\"홍길동\",\"password\":\"password123\",\"userEmail\":\"test@example.com\",\"otpCode\":\"123456\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("userName이 없으면 400을 반환한다")
    void signup_return400_whenUserNameBlank() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/public/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"testuser\",\"password\":\"password123\",\"userEmail\":\"test@example.com\",\"otpCode\":\"123456\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("password가 없으면 400을 반환한다")
    void signup_return400_whenPasswordBlank() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/public/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"testuser\",\"userName\":\"홍길동\",\"userEmail\":\"test@example.com\",\"otpCode\":\"123456\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("userEmail이 없으면 400을 반환한다")
    void signup_return400_whenUserEmailBlank() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/public/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"testuser\",\"userName\":\"홍길동\",\"password\":\"password123\",\"otpCode\":\"123456\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("userEmail 형식이 올바르지 않으면 400을 반환한다")
    void signup_return400_whenInvalidEmail() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/public/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"testuser\",\"userName\":\"홍길동\",\"password\":\"password123\",\"userEmail\":\"not-an-email\",\"otpCode\":\"123456\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("otpCode가 누락되면 400을 반환한다 (Bean Validation)")
    void signup_return400_whenOtpCodeBlank() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/public/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"testuser\",\"userName\":\"홍길동\",\"password\":\"password123\",\"userEmail\":\"test@example.com\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("otpCode가 6자리가 아니면 400을 반환한다 (Bean Validation)")
    void signup_return400_whenOtpCodeLengthInvalid() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/public/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"testuser\",\"userName\":\"홍길동\",\"password\":\"password123\",\"userEmail\":\"test@example.com\",\"otpCode\":\"12345\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("userId 중복 시 409를 반환한다")
    void signup_return409_whenUserIdDuplicated() throws Exception {
        // Given
        when(usersService.signup(any())).thenThrow(new IllegalStateException("이미 사용 중인 아이디입니다."));

        // When & Then
        mockMvc.perform(post("/api/public/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequest)))
            .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("userEmail 중복 시 409를 반환한다")
    void signup_return409_whenEmailDuplicated() throws Exception {
        // Given
        when(usersService.signup(any())).thenThrow(new IllegalStateException("이미 사용 중인 이메일입니다."));

        // When & Then
        mockMvc.perform(post("/api/public/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequest)))
            .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("OTP 검증 실패 시 400 Bad Request와 만료 메시지를 반환한다")
    void signup_return400WithExpiredMessage_whenOtpInvalid() throws Exception {
        // Given
        when(usersService.signup(any()))
            .thenThrow(new IllegalArgumentException("OTP가 만료되었습니다. 다시 발송해주세요."));

        // When & Then
        mockMvc.perform(post("/api/public/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequest)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error.message").value("OTP가 만료되었습니다. 다시 발송해주세요."));
    }

    // ========== RESTful 재설계: 가용성 확인 통합 API ==========

    @Test
    @DisplayName("userId 쿼리 파라미터로 가용성 확인 시 200과 available=true를 반환한다")
    void availability_return200WithAvailableTrue_whenUserIdIsAvailable() throws Exception {
        // Given
        when(usersService.checkAvailability(eq("newuser"), isNull()))
            .thenReturn(CheckDuplicateResponse.ofAvailable());

        // When & Then
        mockMvc.perform(get("/api/public/users/availability").queryParam("userId", "newuser"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.available").value(true));
    }

    @Test
    @DisplayName("userEmail 쿼리 파라미터로 가용성 확인 시 200과 available=true를 반환한다")
    void availability_return200WithAvailableTrue_whenUserEmailIsAvailable() throws Exception {
        // Given
        when(usersService.checkAvailability(isNull(), eq("newuser@example.com")))
            .thenReturn(CheckDuplicateResponse.ofAvailable());

        // When & Then
        mockMvc.perform(get("/api/public/users/availability").queryParam("userEmail", "newuser@example.com"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.available").value(true));
    }

    @Test
    @DisplayName("중복된 userId로 가용성 확인 시 409를 반환한다")
    void availability_return409_whenUserIdIsDuplicate() throws Exception {
        // Given
        when(usersService.checkAvailability(eq("existinguser"), isNull()))
            .thenThrow(new IllegalStateException("이미 사용 중인 아이디입니다."));

        // When & Then
        mockMvc.perform(get("/api/public/users/availability").queryParam("userId", "existinguser"))
            .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("userId, userEmail을 둘 다 생략하면 400을 반환한다")
    void availability_return400_whenBothParamsMissing() throws Exception {
        // Given
        when(usersService.checkAvailability(isNull(), isNull()))
            .thenThrow(new IllegalArgumentException("userId 또는 userEmail 중 하나만 입력해주세요."));

        // When & Then
        mockMvc.perform(get("/api/public/users/availability"))
            .andExpect(status().isBadRequest());
    }

    // ========== 이슈 #3: OTP 방식 비밀번호 변경 (로그인 전) ==========

    @Test
    @DisplayName("유효한 OTP와 새 비밀번호로 변경 요청 시 200 OK와 성공 메시지를 반환한다")
    void changePasswordBeforeLoginWithOtp_return200WithSuccessMessage_whenValidOtp() throws Exception {
        // Given
        ChangePasswordResponse response = ChangePasswordResponse.ofSuccess();
        when(usersService.changePasswordBeforeLogin(any(), any(), any())).thenReturn(response);

        // When & Then
        mockMvc.perform(patch("/api/public/users/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userEmail\":\"test@example.com\",\"otpCode\":\"123456\",\"newPassword\":\"new12345\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.message").value("비밀번호가 변경되었습니다."));
    }

    @Test
    @DisplayName("OTP가 만료되었을 때 400 Bad Request와 만료 메시지를 반환한다")
    void changePasswordBeforeLoginWithOtp_return400WithExpiredMessage_whenOtpExpired() throws Exception {
        // Given
        when(usersService.changePasswordBeforeLogin(any(), any(), any()))
            .thenThrow(new IllegalArgumentException("OTP가 만료되었습니다. 다시 발송해주세요."));

        // When & Then
        mockMvc.perform(patch("/api/public/users/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userEmail\":\"test@example.com\",\"otpCode\":\"123456\",\"newPassword\":\"new12345\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error.message").value("OTP가 만료되었습니다. 다시 발송해주세요."));
    }

    @Test
    @DisplayName("새 비밀번호가 현재 비밀번호와 동일할 때 409 Conflict와 동일 비밀번호 메시지를 반환한다")
    void changePasswordBeforeLoginWithOtp_return409WithSamePasswordMessage_whenNewPasswordEqualsCurrent() throws Exception {
        // Given
        when(usersService.changePasswordBeforeLogin(any(), any(), any()))
            .thenThrow(new IllegalStateException("현재 비밀번호와 동일한 비밀번호로 변경할 수 없습니다."));

        // When & Then
        mockMvc.perform(patch("/api/public/users/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userEmail\":\"test@example.com\",\"otpCode\":\"123456\",\"newPassword\":\"current123\"}"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.error.message").value("현재 비밀번호와 동일한 비밀번호로 변경할 수 없습니다."));
    }

    @Test
    @DisplayName("Bean Validation 검증 실패 시 400 Bad Request를 반환한다 - userEmail blank")
    void changePasswordBeforeLoginWithOtp_return400_whenUserEmailBlank() throws Exception {
        // When & Then
        mockMvc.perform(patch("/api/public/users/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userEmail\":\"\",\"otpCode\":\"123456\",\"newPassword\":\"new12345\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Bean Validation 검증 실패 시 400 Bad Request를 반환한다 - otpCode 길이 오류")
    void changePasswordBeforeLoginWithOtp_return400_whenOtpCodeLengthInvalid() throws Exception {
        // When & Then
        mockMvc.perform(patch("/api/public/users/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userEmail\":\"test@example.com\",\"otpCode\":\"12345\",\"newPassword\":\"new12345\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Bean Validation 검증 실패 시 400 Bad Request를 반환한다 - newPassword 길이 오류")
    void changePasswordBeforeLoginWithOtp_return400_whenNewPasswordLengthInvalid() throws Exception {
        // When & Then
        mockMvc.perform(patch("/api/public/users/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userEmail\":\"test@example.com\",\"otpCode\":\"123456\",\"newPassword\":\"new123\"}"))
            .andExpect(status().isBadRequest());
    }

}
