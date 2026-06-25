package com.platform.api.platform.users.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
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
}
