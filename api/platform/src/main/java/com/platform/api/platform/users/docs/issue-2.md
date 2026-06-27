## 시그니처

### Controller
```java
// UsersController: POST /api/public/users/check-email
// 접근 권한: 인증 불필요 (/api/public/**)

@PostMapping("/check-email")
public ResponseEntity<ApiResponse<CheckDuplicateResponse>> checkEmail(
    @RequestBody @Valid UserEmailCheckRequest request
);
```

### Service
```java
// UsersService.checkDuplicateUserEmail: 이메일 중복 확인
@PlatformTransactional(readOnly = true)
public CheckDuplicateResponse checkDuplicateUserEmail(String userEmail);

// 예외: IllegalStateException("이미 사용 중인 이메일입니다.")
```

### Repository
```java
// 기존 existsByEmail() 메서드 활용 (신규 메서드 없음)
```

### DTO
```java
// UserEmailCheckRequest
@Schema(description = "이메일 중복 확인 요청")
public class UserEmailCheckRequest {
    @NotBlank(message = "userEmail은 필수입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    @Size(max = 100, message = "userEmail은 100자 이하여야 합니다.")
    @Schema(description = "사용자 이메일", example = "test@example.com")
    private String userEmail;
}

// CheckDuplicateResponse — 기존 DTO 활용 (이슈 #1에서 이미 생성됨)
```

### Helper
```java
// 해당 없음 (Service 단독 처리 가능)
```

---

## 이슈 #2: 이메일 중복 확인 API

### 개요
회원가입 전 이메일 중복 여부를 확인하는 API를 구현합니다.

### 범위
- Controller: `UsersController.checkEmail()` 엔드포인트 추가
- Service: `UsersService.checkDuplicateUserEmail()` 메서드 추가
- Repository: 기존 `existsByEmail()` 활용
- DTO: `UserEmailCheckRequest`, `CheckDuplicateResponse`

### Acceptance Criteria
- [x] Given 빈 값이 아닌 userEmail이 주어지고, When 중복 확인 요청하면, Then 200 OK와 available=true 응답
- [x] Given 이미 존재하는 userEmail로 요청하면, Then 409 Conflict와 "이미 사용 중인 이메일입니다." 메시지
- [x] Given 빈 userEmail로 요청하면, Then 400 Bad Request와 "userEmail은 필수입니다." 메시지
- [x] Given 이메일 형식이 아닌 userEmail로 요청하면, Then 400 Bad Request와 "이메일 형식이 올바르지 않습니다." 메시지
- [x] Given 100자 초과 userEmail로 요청하면, Then 400 Bad Request와 "userEmail은 100자 이하여야 합니다." 메시지

### 의존성
없음 (Repository 메서드 기존 존재)

### 네이밍 (spec-fixed.md 준수)
- 클래스: `UserEmailCheckRequest`, `CheckDuplicateResponse`
- 메서드: `checkEmail()`, `checkDuplicateUserEmail()`

---

## 테스트 시나리오

### Service 단위 테스트

- [x] [정상] `UsersService.checkDuplicateUserEmail` — should return available=true when email does not exist
- [x] [예외] `UsersService.checkDuplicateUserEmail` — should throw IllegalStateException when email already exists

### Controller 슬라이스 테스트

- [x] [정상] `UsersController.checkEmail` — should return 200 with available=true when email does not exist
- [x] [예외] `UsersController.checkEmail` — should return 409 with error message when email already exists
- [x] [예외] `UsersController.checkEmail` — should return 400 when userEmail is blank (@NotBlank)
- [x] [예외] `UsersController.checkEmail` — should return 400 when userEmail is invalid email format (@Email)
- [x] [예외] `UsersController.checkEmail` — should return 400 when userEmail exceeds 100 characters (@Size)

### AC 커버리지

| AC | 커버 시나리오 |
|----|-------------|
| Given 빈 값이 아닌 userEmail이 주어지고, When 중복 확인 요청하면, Then 200 OK와 available=true 응답 | [정상] Service.checkDuplicateUserEmail — should return available=true, [정상] Controller.checkEmail — should return 200 |
| Given 이미 존재하는 userEmail로 요청하면, Then 409 Conflict와 "이미 사용 중인 이메일입니다." 메시지 | [예외] Service.checkDuplicateUserEmail — should throw IllegalStateException, [예외] Controller.checkEmail — should return 409 |
| Given 빈 userEmail로 요청하면, Then 400 Bad Request와 "userEmail은 필수입니다." 메시지 | [예외] Controller.checkEmail — should return 400 when blank (@NotBlank) |
| Given 이메일 형식이 아닌 userEmail로 요청하면, Then 400 Bad Request와 "이메일 형식이 올바르지 않습니다." 메시지 | [예외] Controller.checkEmail — should return 400 when invalid format (@Email) |
| Given 100자 초과 userEmail로 요청하면, Then 400 Bad Request와 "userEmail은 100자 이하여야 합니다." 메시지 | [예외] Controller.checkEmail — should return 400 when exceeds 100 chars (@Size) |

---

## AC 검증

검증일: 2026-06-27
결과: ✅ 모든 AC 충족 (5건)

### 검증 내역

| AC | Given | When | Then | 결과 |
|----|-------|------|------|------|
| AC-1 | 빈 값이 아닌 userEmail | POST /api/public/users/check-email | 200 OK + available=true | ✅ |
| AC-2 | 이미 존재하는 userEmail | POST /api/public/users/check-email | 409 Conflict + "이미 사용 중인 이메일입니다." | ✅ |
| AC-3 | 빈 userEmail | POST /api/public/users/check-email | 400 Bad Request + "userEmail은 필수입니다." | ✅ |
| AC-4 | 올바르지 않은 이메일 형식 | POST /api/public/users/check-email | 400 Bad Request + "이메일 형식이 올바르지 않습니다." | ✅ |
| AC-5 | 100자 초과 userEmail | POST /api/public/users/check-email | 400 Bad Request + "userEmail은 100자 이하여야 합니다." | ✅ |

---

## 리팩토링 결과
리팩토링일: 2026-06-27
완료: 0건 / 건너뜀: 0건

### 분석 내역
- UsersService.java (70줄): Helper 추출 불필요, 모든 컨벤션 준수
- UsersController.java (72줄): 프로젝트 패턴 일관성 유지
- UserEmailCheckRequest.java (20줄): Bean Validation 올바르게 적용

---

## 보안 검토

검토일: 2026-06-27

### 즉시 수정 필요 (0건)
- 없음

### 권장 수정 (0건)
- 없음

### 무시 가능 (0건)
- 없음

### 클린 기준 충족
- [x] ./gradlew build -x test: 컴파일 오류 0건
- [x] ./gradlew test: 전체 통과

### 검사 항목별 결과
| 항목 | 결과 |
|------|------|
| 빌드 컴파일 | ✅ 통과 |
| 하드코딩 시크릿 | ✅ 없음 |
| Controller try-catch | ✅ 없음 |
| @Valid 누락 | ✅ 모두 존재 |
| Helper 위반 | ✅ 없음 (Helper 없음) |
| Flyway 우회 DDL | ✅ 없음 |
| 잘못된 예외 타입 | ✅ 없음 (IllegalStateException 사용) |
| SecurityConfig 정합성 | ✅ 통과 (/api/public/users) |
| Swagger 어노테이션 | ✅ @Tag, @Operation 완비 |
