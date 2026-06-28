# 이슈 #4: 비밀번호 변경 API (로그인 후)

## 시그니처

### Controller

```java
// UsersController: 비밀번호 변경 (로그인 후)
// 접근 권한: JWT 필요 (/api/users/** → UsersController)
// 새 Controller 생성 필요 (기존 PublicUsersController는 /api/public/** 전용)

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UsersController {

    private final UsersService usersService;

    @Operation(summary = "비밀번호 변경 (로그인 후)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "변경 성공"),
        @ApiResponse(responseCode = "400", description = "입력값 오류 / 비밀번호 불일치"),
        @ApiResponse(responseCode = "401", description = "JWT 인증 실패 (SecurityConfig 자동 처리)"),
        @ApiResponse(responseCode = "409", description = "현재 비밀번호와 동일")
    })
    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<ChangePasswordResponse>> changePassword(
        @RequestBody @Valid ChangePasswordRequest request
    ) {
        Long userSeq = UserAccountHolder.getSeqNo();
        return ResponseEntity.ok(ApiResponse.of(
            usersService.changePassword(
                userSeq,
                request.getCurrentPassword(),
                request.getNewPassword()
            )
        ));
    }
}
```

### Service

```java
// UsersService.changePassword: 로그인 후 비밀번호 변경
@PlatformTransactional
public ChangePasswordResponse changePassword(
    Long seq,
    String currentPassword,
    String newPassword
);

// 예외: IllegalArgumentException(사용자 없음 / 비밀번호 불일치), IllegalStateException(현재 비밀번호와 동일)
```

### Repository

```java
// UsersRepository.findBySeq: seq로 사용자 조회 (JOOQ)
public UsersEntity findBySeq(Long seq);
```

### DTO

```java
// ChangePasswordRequest: 비밀번호 변경 요청 (로그인 후)
@Getter
@Setter
@Schema(description = "비밀번호 변경 요청 (로그인 후)")
public class ChangePasswordRequest {

    @NotBlank(message = "currentPassword는 필수입니다.")
    @Schema(description = "현재 비밀번호", example = "current123")
    private String currentPassword;

    @NotBlank(message = "newPassword는 필수입니다.")
    @Size(min = 8, max = 12, message = "비밀번호는 8~12자리여야 합니다.")
    @Schema(description = "새 비밀번호", example = "new12345")
    private String newPassword;
}
```

---

## 개요

로그인 후 JWT 인증状态下에서 현재 비밀번호 확인 후 비밀번호를 변경하는 API를 구현합니다.

## 범위

- Controller: `UsersController.changePassword()` 엔드포인트 추가 (`/api/users/change-password`)
- Service: `UsersService.changePassword()` 메서드 추가
- Repository: `findBySeq()` 신규 추가, `updatePassword()` (이슈 #3에서 추가됨)
- DTO: `ChangePasswordRequest`, `ChangePasswordResponse`

## Acceptance Criteria

- [ ] Given JWT 토큰으로 인증된 상태, 올바른 currentPassword, 유효한 newPassword(8~12자)가 주어지고, When 비밀번호 변경 요청하면, Then 200 OK와 success=true 응답, password_changed_time 갱신
- [ ] Given JWT 없이 요청하면, Then 401 Unauthorized (SecurityConfig 자동 처리)
- [ ] Given 올바르지 않은 currentPassword로 요청하면, Then 400 Bad Request와 "현재 비밀번호가 일치하지 않습니다." 메시지
- [ ] Given currentPassword와 동일한 newPassword로 요청하면, Then 409 Conflict와 "현재 비밀번호와 동일합니다." 메시지
- [ ] Given 8자 미만 newPassword로 요청하면, Then 400 Bad Request와 "비밀번호는 8~12자리여야 합니다." 메시지
- [ ] Given 12자 초과 newPassword로 요청하면, Then 400 Bad Request와 "비밀번호는 8~12자리여야 합니다." 메시지
- [ ] Given 빈 currentPassword/newPassword로 요청하면, Then 400 Bad Request와 필수 항목 메시지

## 의존성

이슈 #3 (updatePassword() 메서드 재활용)

## 네이밍 (spec-fixed.md 준수)

- 클래스: `ChangePasswordRequest`, `ChangePasswordResponse`
- 메서드: `changePassword()`, `findBySeq()`

---

## 테스트 시나리오

### Service 단위 테스트

- [ ] [정상] `UsersService.changePassword` — should return success response when valid currentPassword and newPassword given with valid userSeq
- [ ] [경계] `UsersService.changePassword` — should successfully update password when newPassword is exactly 8 characters
- [ ] [경계] `UsersService.changePassword` — should successfully update password when newPassword is exactly 12 characters
- [ ] [예외] `UsersService.changePassword` — should throw IllegalArgumentException when userSeq does not exist (user not found)
- [ ] [예외] `UsersService.changePassword` — should throw IllegalArgumentException when currentPassword does not match
- [ ] [예외] `UsersService.changePassword` — should throw IllegalStateException when newPassword equals currentPassword
- [ ] [예외] `UsersService.changePassword` — should throw IllegalArgumentException when newPassword is less than 8 characters (Bean Validation)
- [ ] [예외] `UsersService.changePassword` — should throw IllegalArgumentException when newPassword is greater than 12 characters (Bean Validation)
- [ ] [예외] `UsersService.changePassword` — should throw IllegalArgumentException when currentPassword is null or empty (Bean Validation)
- [ ] [예외] `UsersService.changePassword` — should throw IllegalArgumentException when newPassword is null or empty (Bean Validation)

### Controller 슬라이스 테스트

- [ ] [정상] `UsersController.changePassword` — should return 200 OK with success=true when valid request given with JWT token
- [ ] [예외] `UsersController.changePassword` — should return 401 Unauthorized when JWT token is not provided (SecurityConfig)
- [ ] [예외] `UsersController.changePassword` — should return 400 Bad Request when currentPassword is incorrect
- [ ] [예외] `UsersController.changePassword` — should return 409 Conflict when newPassword equals currentPassword
- [ ] [예외] `UsersController.changePassword` — should return 400 Bad Request when newPassword is less than 8 characters
- [ ] [예외] `UsersController.changePassword` — should return 400 Bad Request when newPassword is greater than 12 characters
- [ ] [예외] `UsersController.changePassword` — should return 400 Bad Request when currentPassword is empty
- [ ] [예외] `UsersController.changePassword` — should return 400 Bad Request when newPassword is empty

### AC 커버리지

| AC | 커버 시나리오 |
|----|-------------|
| JWT 인증 상태, 올바른 currentPassword, 유효한 newPassword → 200 OK, success=true, password_changed_time 갱신 | [정상] `UsersService.changePassword` — ...userSeq, [정상] `UsersController.changePassword` — ...JWT token |
| JWT 없이 요청 → 401 Unauthorized | [예외] `UsersController.changePassword` — ...JWT token not provided |
| 올바르지 않은 currentPassword → 400 Bad Request, "현재 비밀번호가 일치하지 않습니다." | [예외] `UsersService.changePassword` — ...currentPassword does not match, [예외] `UsersController.changePassword` — ...currentPassword is incorrect |
| currentPassword와 동일한 newPassword → 409 Conflict, "현재 비밀번호와 동일합니다." | [예외] `UsersService.changePassword` — ...newPassword equals currentPassword, [예외] `UsersController.changePassword` — ...newPassword equals currentPassword |
| 8자 미만 newPassword → 400 Bad Request, "비밀번호는 8~12자리여야 합니다." | [예외] `UsersService.changePassword` — ...less than 8 characters, [예외] `UsersController.changePassword` — ...less than 8 characters |
| 12자 초과 newPassword → 400 Bad Request, "비밀번호는 8~12자리여야 합니다." | [예외] `UsersService.changePassword` — ...greater than 12 characters, [예외] `UsersController.changePassword` — ...greater than 12 characters |
| 빈 currentPassword/newPassword → 400 Bad Request, 필수 항목 메시지 | [예외] `UsersService.changePassword` — ...null or empty, [예외] `UsersController.changePassword` — ...empty |

---

## AC 검증

검증일: 2026-06-28
결과: ✅ 모든 AC 충족 (7건)

### AC별 충족 확인

| AC | 구현 위치 | 충족 여부 |
|----|---------|---------|
| JWT 인증 상태, 올바른 currentPassword, 유효한 newPassword → 200 OK + success=true + password_changed_time 갱신 | UsersController.changePassword() → UsersService.changePassword() → UsersRepository.updatePassword() | ✅ |
| JWT 없이 요청 → 401 Unauthorized | SecurityConfig.anyRequest().authenticated() | ✅ |
| 올바르지 않은 currentPassword → 400 Bad Request + "현재 비밀번호가 일치하지 않습니다." | UsersService.changePassword() → IllegalArgumentException throw | ✅ |
| currentPassword와 동일한 newPassword → 409 Conflict + "현재 비밀번호와 동일합니다." | UsersService.changePassword() → IllegalStateException throw | ✅ |
| 8자 미만 newPassword → 400 Bad Request + "비밀번호는 8~12자리여야 합니다." | ChangePasswordRequest.newPassword @Size(min=8) | ✅ |
| 12자 초과 newPassword → 400 Bad Request + "비밀번호는 8~12자리여야 합니다." | ChangePasswordRequest.newPassword @Size(max=12) | ✅ |
| 빈 currentPassword/newPassword → 400 Bad Request + 필수 항목 메시지 | ChangePasswordRequest @NotBlank | ✅ |

---

## 리팩토링 결과
리팩토링일: 2026-06-28
완료: 1건 / 건너뜀: 0건

### 완료 항목
- **UsersService.validatePasswordChange()** — changePasswordBeforeLogin()과 changePassword()의 중복 검증 로직을 private 메서드로 추출 (약 15줄 중복 제거)

---

## 보안 검토

검토일: 2026-06-28

### 즉시 수정 필요
없음

### 권장 수정
- [-] application-datasource-platform.yml:15 — `password: root` 하드코딩 (생략: 로컬 개발용 설정)

### 무시 가능
없음

### 클린 기준 충족
- [x] ./gradlew build -x test: 컴파일 오류 0건
- [x] ./gradlew test: 전체 통과 (56/56)
