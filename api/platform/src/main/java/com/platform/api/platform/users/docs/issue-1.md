## 시그니처

### Controller
```java
// UsersController: POST /api/public/users/check-id
// 접근 권한: 인증 불필요 (/api/public/**)

@Operation(summary = "아이디 중복 확인")
@ApiResponses({
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "사용 가능"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "중복"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "입력값 오류")
})
@PostMapping("/check-id")
public ResponseEntity<ApiResponse<CheckDuplicateResponse>> checkId(
    @RequestBody @Valid UserIdCheckRequest request
);
```

### Service
```java
// UsersService.checkDuplicateUserId: 아이디 중복 여부 확인
// 예외: IllegalStateException("이미 사용 중인 아이디입니다.")

@PlatformTransactional(readOnly = true)
public CheckDuplicateResponse checkDuplicateUserId(String userId);
```

### DTO
```java
// UserIdCheckRequest
@NotBlank(message = "userId는 필수입니다.")
@Size(max = 30, message = "userId는 30자 이하여야 합니다.")
@Schema(description = "사용자 아이디", example = "testuser")
private String userId;

// CheckDuplicateResponse
private boolean available;   // @Schema(description = "사용 가능 여부 (true: 사용 가능, false: 중복)", example = "true")
private String message;      // @Schema(description = "메시지", example = "사용 가능합니다.")

// 정적 팩토리 메서드
public static CheckDuplicateResponse available() { ... }
public static CheckDuplicateResponse duplicate(String field) { ... }
```

---

## 이슈 #1: 아이디 중복 확인 API

### 개요
회원가입 전 아이디 중복 여부를 확인하는 API를 구현합니다.

### 범위
- Controller: `UsersController.checkId()` 엔드포인트 추가
- Service: `UsersService.checkDuplicateUserId()` 메서드 추가
- Repository: 기존 `existsByUserId()` 활용
- DTO: `UserIdCheckRequest`, `CheckDuplicateResponse`

### Acceptance Criteria
- [x] Given 빈 값이 아닌 userId가 주어지고, When 중복 확인 요청하면, Then 200 OK와 available=true 응답
- [x] Given 이미 존재하는 userId로 요청하면, Then 409 Conflict와 "이미 사용 중인 아이디입니다." 메시지
- [x] Given 빈 userId로 요청하면, Then 400 Bad Request와 "userId는 필수입니다." 메시지
- [x] Given 30자 초과 userId로 요청하면, Then 400 Bad Request와 "userId는 30자 이하여야 합니다." 메시지

### 의존성
없음 (Repository 메서드 기존 존재)

### 네이밍 (spec-fixed.md 준수)
- 클래스: `UserIdCheckRequest`, `CheckDuplicateResponse`
- 메서드: `checkId()`, `checkDuplicateUserId()`

---

## 테스트 시나리오

### Service 단위 테스트

- [x] [정상] UsersService.checkDuplicateUserId — should return available=true when userId does not exist
- [x] [예외] UsersService.checkDuplicateUserId — should throw IllegalStateException when userId already exists

### Controller 슬라이스 테스트

- [x] [정상] UsersController.checkId — should return 200 with available=true when userId is available
- [x] [예외] UsersController.checkId — should return 409 when userId is duplicate
- [x] [경계] UsersController.checkId — should return 400 when userId is empty (Bean Validation)
- [x] [경계] UsersController.checkId — should return 400 when userId exceeds 30 chars (Bean Validation)

### AC 커버리지

| AC | 커버 시나리오 |
|----|-------------|
| 빈 값이 아닌 userId → 200 OK, available=true | [정상] Service.checkDuplicateUserId — available, [정상] Controller.checkId — 200 |
| 이미 존재하는 userId → 409 Conflict | [예외] Service.checkDuplicateUserId — IllegalStateException, [예외] Controller.checkId — 409 |
| 빈 userId → 400 Bad Request | [경계] Controller.checkId — 400 (empty) |
| 30자 초과 userId → 400 Bad Request | [경계] Controller.checkId — 400 (exceeds 30 chars) |

---

## AC 검증

검증일: 2026-06-26
결과: ✅ 모든 AC 충족 (4건)

---

## 리팩토링 결과
리팩토링일: 2026-06-26
완료: 0건 / 건너뜀: 0건
분석: 리팩토링 대상 없음 (Service 61줄, Controller 57줄, 컨벤션 준수)

---

## 보안 검토

검토일: 2026-06-26

### 즉시 수정 필요 (처리 완료)
- [x] 없음

### 권장 수정
- [x] 없음

### 무시 가능
- [x] 없음

### 클린 기준 충족
- [x] ./gradlew build -x test: 컴파일 오류 0건
- [x] ./gradlew test: 전체 통과 (17/17)
