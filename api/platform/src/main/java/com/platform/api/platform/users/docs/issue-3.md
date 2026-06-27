t# 이슈 #3: 비밀번호 변경 API (로그인 전)

## 개요
로그인 전 이메일과 현재 비밀번호로 비밀번호를 변경하는 API를 구현합니다.

## 범위
- Controller: `UsersController.changePasswordBeforeLogin()` 엔드포인트 추가
- Service: `UsersService.changePasswordBeforeLogin()` 메서드 추가
- Repository: `findByUserEmail()` 신규 추가, `updatePassword()` 신규 추가
- DTO: `ChangePasswordBeforeLoginRequest`, `ChangePasswordResponse`

## 시그니처

### Controller
```java
// UsersController: POST /api/public/users/change-password
// 접근 권한: 인증 불필요 (/api/public/**)

@PostMapping("/change-password")
public ResponseEntity<ApiResponse<ChangePasswordResponse>> changePasswordBeforeLogin(
    @RequestBody @Valid ChangePasswordBeforeLoginRequest request
);
```

### Service
```java
// UsersService.changePasswordBeforeLogin: 로그인 전 비밀번호 변경
@PlatformTransactional
public ChangePasswordResponse changePasswordBeforeLogin(
    String userEmail,
    String currentPassword,
    String newPassword
);

// 예외: IllegalArgumentException(해당 이메일로 등록된 사용자 없음 / 현재 비밀번호 불일치)
//       IllegalStateException(현재 비밀번호와 동일)
```

### Repository
```java
// UsersRepository.findByUserEmail: 이메일로 사용자 조회 (JOOQ)
public UsersEntity findByUserEmail(String userEmail);

// UsersRepository.updatePassword: 비밀번호 수정 (JOOQ)
// updatedBy는 0L (로그인 전이므로 시스템 갱신)
public void updatePassword(Long seq, String newPassword, Long updatedBy);
```

### DTO
```java
// ChangePasswordBeforeLoginRequest
@NotBlank(message = "userEmail은 필수입니다.")
@Email(message = "이메일 형식이 올바르지 않습니다.")
@Schema(description = "사용자 이메일", example = "test@example.com")
private String userEmail;

@NotBlank(message = "currentPassword는 필수입니다.")
@Schema(description = "현재 비밀번호", example = "current123")
private String currentPassword;

@NotBlank(message = "newPassword는 필수입니다.")
@Size(min = 8, max = 12, message = "비밀번호는 8~12자리여야 합니다.")
@Schema(description = "새 비밀번호", example = "new12345")
private String newPassword;
```

---

## Acceptance Criteria

- [x] Given 존재하는 userEmail, 올바른 currentPassword, 유효한 newPassword(8~12자)가 주어지고, When 비밀번호 변경 요청하면, Then 200 OK와 success=true 응답, password_changed_time 갱신
- [x] Given 존재하지 않는 userEmail로 요청하면, Then 400 Bad Request와 "해당 이메일로 등록된 사용자가 없습니다." 메시지
- [x] Given 올바르지 않은 currentPassword로 요청하면, Then 400 Bad Request와 "현재 비밀번호가 일치하지 않습니다." 메시지
- [x] Given currentPassword와 동일한 newPassword로 요청하면, Then 409 Conflict와 "현재 비밀번호와 동일합니다." 메시지
- [x] Given 8자 미만 newPassword로 요청하면, Then 400 Bad Request와 "비밀번호는 8~12자리여야 합니다." 메시지
- [x] Given 12자 초과 newPassword로 요청하면, Then 400 Bad Request와 "비밀번호는 8~12자리여야 합니다." 메시지
- [x] Given 빈 userEmail/currentPassword/newPassword로 요청하면, Then 400 Bad Request와 필수 항목 메시지
- [x] Given 올바르지 않은 이메일 형식으로 요청하면, Then 400 Bad Request와 "이메일 형식이 올바르지 않습니다." 메시지

## 의존성
없음 (단, UsersRepository에 메서드 2개 추가 필요)

## 네이밍 (spec-fixed.md 준수)
- 클래스: `ChangePasswordBeforeLoginRequest`, `ChangePasswordResponse`
- 메서드: `changePasswordBeforeLogin()`, `findByUserEmail()`, `updatePassword()`

---

## 테스트 시나리오

### Service 단위 테스트

- [x] [정상] UsersService.changePasswordBeforeLogin — should return ChangePasswordResponse with success=true when valid userEmail, correct currentPassword, and valid newPassword(8~12 chars)
- [x] [예외] UsersService.changePasswordBeforeLogin — should throw IllegalArgumentException when userEmail does not exist
- [x] [예외] UsersService.changePasswordBeforeLogin — should throw IllegalArgumentException when currentPassword is incorrect
- [x] [예외] UsersService.changePasswordBeforeLogin — should throw IllegalStateException when newPassword equals currentPassword
- [x] [경계] UsersService.changePasswordBeforeLogin — should update password_changed_time when password change succeeds

### Controller 슬라이스 테스트

- [x] [정상] UsersController.changePasswordBeforeLogin — should return 200 OK with success=true when valid request
- [x] [예외] UsersController.changePasswordBeforeLogin — should return 400 Bad Request when userEmail not found
- [x] [예외] UsersController.changePasswordBeforeLogin — should return 400 Bad Request when currentPassword is incorrect
- [x] [예외] UsersController.changePasswordBeforeLogin — should return 409 Conflict when newPassword equals currentPassword
- [x] [예외] UsersController.changePasswordBeforeLogin — should return 400 Bad Request when newPassword is less than 8 chars
- [x] [예외] UsersController.changePasswordBeforeLogin — should return 400 Bad Request when newPassword exceeds 12 chars
- [x] [예외] UsersController.changePasswordBeforeLogin — should return 400 Bad Request when userEmail/currentPassword/newPassword is empty (Bean Validation)
- [x] [예외] UsersController.changePasswordBeforeLogin — should return 400 Bad Request when userEmail format is invalid (Bean Validation)

### AC 커버리지

| AC | 커버 시나리오 |
|----|-------------|
| Given 존재하는 userEmail, 올바른 currentPassword, 유효한 newPassword(8~12자)가 주어지고, When 비밀번호 변경 요청하면, Then 200 OK와 success=true 응답, password_changed_time 갱신 | [정상] Service.changePasswordBeforeLogin — should return ChangePasswordResponse with success=true when valid userEmail, correct currentPassword, and valid newPassword(8~12 chars), [정상] Controller.changePasswordBeforeLogin — should return 200 OK with success=true when valid request, [경계] Service.changePasswordBeforeLogin — should update password_changed_time when password change succeeds |
| Given 존재하지 않는 userEmail로 요청하면, Then 400 Bad Request와 "해당 이메일로 등록된 사용자가 없습니다." 메시지 | [예외] Service.changePasswordBeforeLogin — should throw IllegalArgumentException when userEmail does not exist, [예외] Controller.changePasswordBeforeLogin — should return 400 Bad Request when userEmail not found |
| Given 올바르지 않은 currentPassword로 요청하면, Then 400 Bad Request와 "현재 비밀번호가 일치하지 않습니다." 메시지 | [예외] Service.changePasswordBeforeLogin — should throw IllegalArgumentException when currentPassword is incorrect, [예외] Controller.changePasswordBeforeLogin — should return 400 Bad Request when currentPassword is incorrect |
| Given currentPassword와 동일한 newPassword로 요청하면, Then 409 Conflict와 "현재 비밀번호와 동일합니다." 메시지 | [예외] Service.changePasswordBeforeLogin — should throw IllegalStateException when newPassword equals currentPassword, [예외] Controller.changePasswordBeforeLogin — should return 409 Conflict when newPassword equals currentPassword |
| Given 8자 미만 newPassword로 요청하면, Then 400 Bad Request와 "비밀번호는 8~12자리여야 합니다." 메시지 | [예외] Controller.changePasswordBeforeLogin — should return 400 Bad Request when newPassword is less than 8 chars |
| Given 12자 초과 newPassword로 요청하면, Then 400 Bad Request와 "비밀번호는 8~12자리여야 합니다." 메시지 | [예외] Controller.changePasswordBeforeLogin — should return 400 Bad Request when newPassword exceeds 12 chars |
| Given 빈 userEmail/currentPassword/newPassword로 요청하면, Then 400 Bad Request와 필수 항목 메시지 | [예외] Controller.changePasswordBeforeLogin — should return 400 Bad Request when userEmail/currentPassword/newPassword is empty (Bean Validation) |
| Given 올바르지 않은 이메일 형식으로 요청하면, Then 400 Bad Request와 "이메일 형식이 올바르지 않습니다." 메시지 | [예외] Controller.changePasswordBeforeLogin — should return 400 Bad Request when userEmail format is invalid (Bean Validation) |

---

## AC 검증

검증일: 2026-06-27
결과: ✅ 모든 AC 충족 (8건)

---

## 보안 검토

검토일: 2026-06-27

### 즉시 수정 필요
없음

### 권장 수정
없음

### 무시 가능
없음

### 클린 기준 충족
- [x] ./gradlew build -x test: 컴파일 오류 0건
- [x] ./gradlew test: 전체 통과
