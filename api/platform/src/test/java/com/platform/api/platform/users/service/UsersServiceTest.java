package com.platform.api.platform.users.service;

import com.platform.api.platform.users.dto.UsersSignupRequest;
import com.platform.api.platform.users.dto.UsersSignupResponse;
import com.platform.datasource.platform.jooq.generated.tables.pojos.UsersEntity;
import com.platform.datasource.platform.repository.users.UsersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsersServiceTest {

    @Mock
    private UsersRepository usersRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsersService usersService;

    private UsersSignupRequest request;

    @BeforeEach
    void setUp() {
        request = new UsersSignupRequest();
        request.setUserId("testuser");
        request.setUserName("홍길동");
        request.setPassword("password123");
        request.setUserEmail("test@example.com");
    }

    @Test
    @DisplayName("유효한 요청 시 UsersSignupResponse(seq, userId, userName)를 반환한다")
    void signup_returnResponse_whenValidRequest() {
        // Given
        when(usersRepository.existsByUserId("testuser")).thenReturn(false);
        when(usersRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("$2a$10$encodedPassword");
        when(usersRepository.insertUser(any())).thenReturn(1L);
        when(usersRepository.findRoleSeqByName("USER")).thenReturn(1L);

        // When
        UsersSignupResponse result = usersService.signup(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getSeq()).isEqualTo(1L);
        assertThat(result.getUserId()).isEqualTo("testuser");
        assertThat(result.getUserName()).isEqualTo("홍길동");
    }

    @Test
    @DisplayName("유효한 요청 시 BCrypt로 인코딩된 비밀번호를 저장한다")
    void signup_encodePasswordWithBCrypt_whenValidRequest() {
        // Given
        when(usersRepository.existsByUserId("testuser")).thenReturn(false);
        when(usersRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("$2a$10$encodedPassword");
        when(usersRepository.insertUser(any())).thenReturn(1L);
        when(usersRepository.findRoleSeqByName("USER")).thenReturn(1L);

        // When
        usersService.signup(request);

        // Then
        ArgumentCaptor<UsersEntity> captor = ArgumentCaptor.forClass(UsersEntity.class);
        verify(usersRepository).insertUser(captor.capture());
        String storedPassword = captor.getValue().getUserPassword();
        assertThat(storedPassword).isNotEqualTo("password123");
        assertThat(storedPassword).startsWith("$2a$");
    }

    @Test
    @DisplayName("가입 성공 후 USER role seq로 insertUserRole을 호출한다")
    void signup_callInsertUserRole_withUserRoleSeq_whenSignupSuccess() {
        // Given
        when(usersRepository.existsByUserId("testuser")).thenReturn(false);
        when(usersRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("$2a$10$encodedPassword");
        when(usersRepository.insertUser(any())).thenReturn(1L);
        when(usersRepository.findRoleSeqByName("USER")).thenReturn(1L);

        // When
        usersService.signup(request);

        // Then
        verify(usersRepository).insertUserRole(1L, 1L, 0L);
    }

    @Test
    @DisplayName("userId가 이미 존재하면 IllegalStateException을 던진다")
    void signup_throwIllegalStateException_whenUserIdDuplicated() {
        // Given
        when(usersRepository.existsByUserId("testuser")).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> usersService.signup(request))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("이미 사용 중인 아이디입니다.");
    }

    @Test
    @DisplayName("userEmail이 이미 존재하면 IllegalStateException을 던진다")
    void signup_throwIllegalStateException_whenEmailDuplicated() {
        // Given
        when(usersRepository.existsByUserId("testuser")).thenReturn(false);
        when(usersRepository.existsByEmail("test@example.com")).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> usersService.signup(request))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("이미 사용 중인 이메일입니다.");
    }

    @Test
    @DisplayName("userId 중복 시 insertUser를 호출하지 않는다")
    void signup_notCallInsertUser_whenUserIdDuplicated() {
        // Given
        when(usersRepository.existsByUserId("testuser")).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> usersService.signup(request))
            .isInstanceOf(IllegalStateException.class);

        verify(usersRepository, never()).insertUser(any());
    }
}
