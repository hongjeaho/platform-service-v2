package com.platform.api.platform.users.service;

import com.platform.api.platform.users.dto.ChangePasswordResponse;
import com.platform.api.platform.users.dto.CheckDuplicateResponse;
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
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
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

    // ========== 이슈 #1: 아이디 중복 확인 API ==========

    @Test
    @DisplayName("존재하지 않는 userId로 중복 확인 시 사용 가능 응답을 반환한다")
    void checkDuplicateUserId_returnAvailableTrue_whenUserIdNotExists() {
        // Given
        String userId = "newuser";
        when(usersRepository.existsByUserId(userId)).thenReturn(false);

        // When
        CheckDuplicateResponse response = usersService.checkDuplicateUserId(userId);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.isAvailable()).isTrue();
        assertThat(response.getMessage()).isEqualTo("사용 가능합니다.");
    }

    @Test
    @DisplayName("이미 존재하는 userId로 중복 확인 시 IllegalStateException을 던진다")
    void checkDuplicateUserId_throwIllegalStateException_whenUserIdAlreadyExists() {
        // Given
        String userId = "existinguser";
        when(usersRepository.existsByUserId(userId)).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> usersService.checkDuplicateUserId(userId))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("이미 사용 중인 아이디입니다.");
    }

    // ========== 이슈 #2: 이메일 중복 확인 API ==========

    @Test
    @DisplayName("존재하지 않는 userEmail로 중복 확인 시 사용 가능 응답을 반환한다")
    void checkDuplicateUserEmail_returnAvailableTrue_whenEmailNotExists() {
        // Given
        String userEmail = "newuser@example.com";
        when(usersRepository.existsByEmail(userEmail)).thenReturn(false);

        // When
        CheckDuplicateResponse response = usersService.checkDuplicateUserEmail(userEmail);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.isAvailable()).isTrue();
        assertThat(response.getMessage()).isEqualTo("사용 가능합니다.");
    }

    @Test
    @DisplayName("이미 존재하는 userEmail로 중복 확인 시 IllegalStateException을 던진다")
    void checkDuplicateUserEmail_throwIllegalStateException_whenEmailAlreadyExists() {
        // Given
        String userEmail = "existing@example.com";
        when(usersRepository.existsByEmail(userEmail)).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> usersService.checkDuplicateUserEmail(userEmail))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("이미 사용 중인 이메일입니다.");
    }

    // ========== 이슈 #3: 비밀번호 변경 API (로그인 전) ==========

    @Test
    @DisplayName("유효한 userEmail, 올바른 currentPassword, 유효한 newPassword로 비밀번호 변경 시 success=true를 반환한다")
    void changePasswordBeforeLogin_returnSuccessTrue_whenValidInputs() {
        // Given
        String userEmail = "test@example.com";
        String currentPassword = "current123";
        String newPassword = "new12345";

        UsersEntity existingUser = new UsersEntity();
        existingUser.setSeq(1L);
        existingUser.setUserEmail(userEmail);
        existingUser.setUserPassword("$2a$10$encodedCurrent123");

        when(usersRepository.findByUserEmail(userEmail)).thenReturn(existingUser);
        when(passwordEncoder.matches(currentPassword, existingUser.getUserPassword())).thenReturn(true);

        // When
        ChangePasswordResponse result = usersService.changePasswordBeforeLogin(userEmail, currentPassword, newPassword);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.isSuccess()).isTrue();
    }

    @Test
    @DisplayName("존재하지 않는 userEmail로 비밀번호 변경 시 IllegalArgumentException을 던진다")
    void changePasswordBeforeLogin_throwIllegalArgumentException_whenUserEmailDoesNotExist() {
        // Given
        String userEmail = "nonexistent@example.com";
        String currentPassword = "current123";
        String newPassword = "new12345";

        when(usersRepository.findByUserEmail(userEmail)).thenReturn(null);

        // When & Then
        assertThatThrownBy(() -> usersService.changePasswordBeforeLogin(userEmail, currentPassword, newPassword))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("해당 이메일로 등록된 사용자가 없습니다.");
    }

    @Test
    @DisplayName("올바르지 않은 currentPassword로 비밀번호 변경 시 IllegalArgumentException을 던진다")
    void changePasswordBeforeLogin_throwIllegalArgumentException_whenCurrentPasswordIsIncorrect() {
        // Given
        String userEmail = "test@example.com";
        String currentPassword = "wrongPassword";
        String newPassword = "new12345";

        UsersEntity existingUser = new UsersEntity();
        existingUser.setSeq(1L);
        existingUser.setUserEmail(userEmail);
        existingUser.setUserPassword("$2a$10$encodedCurrent123");

        when(usersRepository.findByUserEmail(userEmail)).thenReturn(existingUser);
        when(passwordEncoder.matches(currentPassword, existingUser.getUserPassword())).thenReturn(false);

        // When & Then
        assertThatThrownBy(() -> usersService.changePasswordBeforeLogin(userEmail, currentPassword, newPassword))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("현재 비밀번호가 일치하지 않습니다.");
    }

    @Test
    @DisplayName("newPassword가 currentPassword와 동일하면 IllegalStateException을 던진다")
    void changePasswordBeforeLogin_throwIllegalStateException_whenNewPasswordEqualsCurrentPassword() {
        // Given
        String userEmail = "test@example.com";
        String currentPassword = "current123";
        String newPassword = "current123";

        UsersEntity existingUser = new UsersEntity();
        existingUser.setSeq(1L);
        existingUser.setUserEmail(userEmail);
        existingUser.setUserPassword("$2a$10$encodedCurrent123");

        when(usersRepository.findByUserEmail(userEmail)).thenReturn(existingUser);
        when(passwordEncoder.matches(currentPassword, existingUser.getUserPassword())).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> usersService.changePasswordBeforeLogin(userEmail, currentPassword, newPassword))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("현재 비밀번호와 동일합니다.");
    }

    @Test
    @DisplayName("비밀번호 변경 성공 시 password_changed_time이 갱신된다")
    void changePasswordBeforeLogin_updatePasswordChangedTime_whenPasswordChangeSucceeds() {
        // Given
        String userEmail = "test@example.com";
        String currentPassword = "current123";
        String newPassword = "new12345";

        UsersEntity existingUser = new UsersEntity();
        existingUser.setSeq(1L);
        existingUser.setUserEmail(userEmail);
        existingUser.setUserPassword("$2a$10$encodedCurrent123");
        existingUser.setPasswordChangedTime(LocalDateTime.now().minusDays(1));

        when(usersRepository.findByUserEmail(userEmail)).thenReturn(existingUser);
        when(passwordEncoder.matches(currentPassword, existingUser.getUserPassword())).thenReturn(true);
        when(passwordEncoder.encode(newPassword)).thenReturn("$2a$10$encodedNew12345");

        // When
        usersService.changePasswordBeforeLogin(userEmail, currentPassword, newPassword);

        // Then
        verify(usersRepository).updatePassword(eq(1L), any(), eq(0L));
    }

    // ========== 이슈 #4: 비밀번호 변경 API (로그인 후) ==========

    @Test
    @DisplayName("유효한 userSeq, 올바른 currentPassword, 유효한 newPassword로 비밀번호 변경 시 success response를 반환한다")
    void changePassword_returnSuccessResponse_whenValidInputs() {
        // Given
        Long userSeq = 1L;
        String currentPassword = "current123";
        String newPassword = "new12345";

        UsersEntity existingUser = new UsersEntity();
        existingUser.setSeq(userSeq);
        existingUser.setUserPassword("$2a$10$encodedCurrent123");

        when(usersRepository.findBySeq(userSeq)).thenReturn(existingUser);
        when(passwordEncoder.matches(currentPassword, existingUser.getUserPassword())).thenReturn(true);
        when(passwordEncoder.encode(newPassword)).thenReturn("$2a$10$encodedNew12345");

        // When
        ChangePasswordResponse result = usersService.changePassword(userSeq, currentPassword, newPassword);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.isSuccess()).isTrue();
    }

    @Test
    @DisplayName("newPassword가 8자일 때 비밀번호 변경이 성공한다")
    void changePassword_returnSuccessResponse_whenNewPasswordIsExactly8Characters() {
        // Given
        Long userSeq = 1L;
        String currentPassword = "current123";
        String newPassword = "new1234"; // exactly 8 characters

        UsersEntity existingUser = new UsersEntity();
        existingUser.setSeq(userSeq);
        existingUser.setUserPassword("$2a$10$encodedCurrent123");

        when(usersRepository.findBySeq(userSeq)).thenReturn(existingUser);
        when(passwordEncoder.matches(currentPassword, existingUser.getUserPassword())).thenReturn(true);
        when(passwordEncoder.encode(newPassword)).thenReturn("$2a$10$encodedNew1234");

        // When
        ChangePasswordResponse result = usersService.changePassword(userSeq, currentPassword, newPassword);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.isSuccess()).isTrue();
    }

    @Test
    @DisplayName("newPassword가 12자일 때 비밀번호 변경이 성공한다")
    void changePassword_returnSuccessResponse_whenNewPasswordIsExactly12Characters() {
        // Given
        Long userSeq = 1L;
        String currentPassword = "current123";
        String newPassword = "new12345678"; // exactly 12 characters

        UsersEntity existingUser = new UsersEntity();
        existingUser.setSeq(userSeq);
        existingUser.setUserPassword("$2a$10$encodedCurrent123");

        when(usersRepository.findBySeq(userSeq)).thenReturn(existingUser);
        when(passwordEncoder.matches(currentPassword, existingUser.getUserPassword())).thenReturn(true);
        when(passwordEncoder.encode(newPassword)).thenReturn("$2a$10$encodedNew12345678");

        // When
        ChangePasswordResponse result = usersService.changePassword(userSeq, currentPassword, newPassword);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.isSuccess()).isTrue();
    }

    @Test
    @DisplayName("userSeq가 존재하지 않을 때 IllegalArgumentException을 던진다")
    void changePassword_throwIllegalArgumentException_whenUserSeqDoesNotExist() {
        // Given
        Long userSeq = 999L;
        String currentPassword = "current123";
        String newPassword = "new12345";

        when(usersRepository.findBySeq(userSeq)).thenReturn(null);

        // When & Then
        assertThatThrownBy(() -> usersService.changePassword(userSeq, currentPassword, newPassword))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("해당 이메일로 등록된 사용자가 없습니다.");
    }

    @Test
    @DisplayName("currentPassword가 일치하지 않을 때 IllegalArgumentException을 던진다")
    void changePassword_throwIllegalArgumentException_whenCurrentPasswordDoesNotMatch() {
        // Given
        Long userSeq = 1L;
        String currentPassword = "wrongPassword";
        String newPassword = "new12345";

        UsersEntity existingUser = new UsersEntity();
        existingUser.setSeq(userSeq);
        existingUser.setUserPassword("$2a$10$encodedCurrent123");

        when(usersRepository.findBySeq(userSeq)).thenReturn(existingUser);
        when(passwordEncoder.matches(currentPassword, existingUser.getUserPassword())).thenReturn(false);

        // When & Then
        assertThatThrownBy(() -> usersService.changePassword(userSeq, currentPassword, newPassword))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("현재 비밀번호가 일치하지 않습니다.");
    }

    @Test
    @DisplayName("newPassword가 currentPassword와 동일할 때 IllegalStateException을 던진다")
    void changePassword_throwIllegalStateException_whenNewPasswordEqualsCurrentPassword() {
        // Given
        Long userSeq = 1L;
        String currentPassword = "current123";
        String newPassword = "current123"; // same as current

        UsersEntity existingUser = new UsersEntity();
        existingUser.setSeq(userSeq);
        existingUser.setUserPassword("$2a$10$encodedCurrent123");

        when(usersRepository.findBySeq(userSeq)).thenReturn(existingUser);
        when(passwordEncoder.matches(currentPassword, existingUser.getUserPassword())).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> usersService.changePassword(userSeq, currentPassword, newPassword))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("현재 비밀번호와 동일합니다.");
    }

    @Test
    @DisplayName("비밀번호 변경 성공 시 updatePassword가 호출된다")
    void changePassword_callUpdatePassword_whenPasswordChangeSucceeds() {
        // Given
        Long userSeq = 1L;
        String currentPassword = "current123";
        String newPassword = "new12345";

        UsersEntity existingUser = new UsersEntity();
        existingUser.setSeq(userSeq);
        existingUser.setUserPassword("$2a$10$encodedCurrent123");

        when(usersRepository.findBySeq(userSeq)).thenReturn(existingUser);
        when(passwordEncoder.matches(currentPassword, existingUser.getUserPassword())).thenReturn(true);
        when(passwordEncoder.encode(newPassword)).thenReturn("$2a$10$encodedNew12345");

        // When
        usersService.changePassword(userSeq, currentPassword, newPassword);

        // Then
        verify(usersRepository).updatePassword(eq(userSeq), any(), any());
    }
}
