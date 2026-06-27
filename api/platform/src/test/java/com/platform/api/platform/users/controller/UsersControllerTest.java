package com.platform.api.platform.users.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
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

    private UsersSignupRequest validRequest;
    private UsersSignupResponse signupResponse;

    @BeforeEach
    void setUp() {
        validRequest = new UsersSignupRequest();
        validRequest.setUserId("testuser");
        validRequest.setUserName("홍길동");
        validRequest.setPassword("password123");
        validRequest.setUserEmail("test@example.com");

        signupResponse = new UsersSignupResponse();
        signupResponse.setSeq(1L);
        signupResponse.setUserId("testuser");
        signupResponse.setUserName("홍길동");
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
                .content("{\"userName\":\"홍길동\",\"password\":\"password123\",\"userEmail\":\"test@example.com\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("userName이 없으면 400을 반환한다")
    void signup_return400_whenUserNameBlank() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/public/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"testuser\",\"password\":\"password123\",\"userEmail\":\"test@example.com\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("password가 없으면 400을 반환한다")
    void signup_return400_whenPasswordBlank() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/public/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"testuser\",\"userName\":\"홍길동\",\"userEmail\":\"test@example.com\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("userEmail이 없으면 400을 반환한다")
    void signup_return400_whenUserEmailBlank() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/public/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"testuser\",\"userName\":\"홍길동\",\"password\":\"password123\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("userEmail 형식이 올바르지 않으면 400을 반환한다")
    void signup_return400_whenInvalidEmail() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/public/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"testuser\",\"userName\":\"홍길동\",\"password\":\"password123\",\"userEmail\":\"not-an-email\"}"))
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

    // ========== 이슈 #1: 아이디 중복 확인 API ==========

    @Test
    @DisplayName("사용 가능한 userId로 중복 확인 시 200과 available=true를 반환한다")
    void checkId_return200WithAvailableTrue_whenUserIdIsAvailable() throws Exception {
        // Given
        CheckDuplicateResponse response = CheckDuplicateResponse.available();
        when(usersService.checkDuplicateUserId(eq("newuser"))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/public/users/check-id")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"newuser\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.available").value(true))
            .andExpect(jsonPath("$.data.message").value("사용 가능합니다."));
    }

    @Test
    @DisplayName("중복된 userId로 중복 확인 시 409를 반환한다")
    void checkId_return409_whenUserIdIsDuplicate() throws Exception {
        // Given
        when(usersService.checkDuplicateUserId(eq("existinguser")))
            .thenThrow(new IllegalStateException("이미 사용 중인 아이디입니다."));

        // When & Then
        mockMvc.perform(post("/api/public/users/check-id")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"existinguser\"}"))
            .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("빈 userId로 중복 확인 시 400을 반환한다 (Bean Validation)")
    void checkId_return400_whenUserIdIsEmpty() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/public/users/check-id")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("30자 초과 userId로 중복 확인 시 400을 반환한다 (Bean Validation)")
    void checkId_return400_whenUserIdExceeds30Chars() throws Exception {
        // When & Then
        String longUserId = "a".repeat(31);
        mockMvc.perform(post("/api/public/users/check-id")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"" + longUserId + "\"}"))
            .andExpect(status().isBadRequest());
    }

    // ========== 이슈 #2: 이메일 중복 확인 API ==========

    @Test
    @DisplayName("사용 가능한 userEmail로 중복 확인 시 200과 available=true를 반환한다")
    void checkEmail_return200WithAvailableTrue_whenEmailIsAvailable() throws Exception {
        // Given
        CheckDuplicateResponse response = CheckDuplicateResponse.available();
        when(usersService.checkDuplicateUserEmail(eq("newuser@example.com"))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/public/users/check-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userEmail\":\"newuser@example.com\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.available").value(true))
            .andExpect(jsonPath("$.data.message").value("사용 가능합니다."));
    }

    @Test
    @DisplayName("중복된 userEmail로 중복 확인 시 409를 반환한다")
    void checkEmail_return409_whenEmailIsDuplicate() throws Exception {
        // Given
        when(usersService.checkDuplicateUserEmail(eq("existing@example.com")))
            .thenThrow(new IllegalStateException("이미 사용 중인 이메일입니다."));

        // When & Then
        mockMvc.perform(post("/api/public/users/check-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userEmail\":\"existing@example.com\"}"))
            .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("빈 userEmail로 중복 확인 시 400을 반환한다 (Bean Validation)")
    void checkEmail_return400_whenEmailIsBlank() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/public/users/check-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userEmail\":\"\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("올바르지 않은 이메일 형식으로 중복 확인 시 400을 반환한다 (Bean Validation)")
    void checkEmail_return400_whenEmailIsInvalid() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/public/users/check-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userEmail\":\"not-an-email\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("100자 초과 userEmail로 중복 확인 시 400을 반환한다 (Bean Validation)")
    void checkEmail_return400_whenEmailExceeds100Chars() throws Exception {
        // When & Then
        String longEmail = "a".repeat(90) + "@example.com"; // 101자
        mockMvc.perform(post("/api/public/users/check-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userEmail\":\"" + longEmail + "\"}"))
            .andExpect(status().isBadRequest());
    }
}
