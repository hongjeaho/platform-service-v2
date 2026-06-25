## 시그니처

### Controller

```java
// UsersController: POST /api/public/users
// 접근 권한: 인증 불필요 (/api/public/**)

@Tag(name = "users", description = "회원 관리 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/users")
public class UsersController {

    @Operation(summary = "회원 등록")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "등록 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "입력값 오류"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "중복 아이디 또는 이메일")
    })
    @PostMapping
    public ResponseEntity<ApiResponse<UsersSignupResponse>> signup(
        @RequestBody @Valid UsersSignupRequest request
    );
}
```

### Service

```java
// UsersService.signup: 신규 회원 등록 (userId·userEmail 중복 체크, BCrypt 인코딩, USER 권한 부여)
@PlatformTransactional
public UsersSignupResponse signup(UsersSignupRequest request);
// 예외: IllegalStateException("이미 사용 중인 아이디입니다.") — userId 중복 시
// 예외: IllegalStateException("이미 사용 중인 이메일입니다.") — userEmail 중복 시
```

### Repository

```java
// UsersRepository: datasource/platform — 신규 클래스 (JOOQ 재생성 후 UsersEntity 사용 가능)

// existsByUserId: userId 존재 여부 확인 (JOOQ)
public boolean existsByUserId(String userId);

// existsByEmail: userEmail 존재 여부 확인 (JOOQ)
public boolean existsByEmail(String email);

// insertUser: 신규 회원 삽입, 생성된 seq 반환 (JOOQ)
public Long insertUser(UsersEntity user);

// findRoleSeqByName: role_name으로 roles.seq 조회 (JOOQ)
public Long findRoleSeqByName(String roleName);

// insertUserRole: user_roles 삽입 (JOOQ)
public void insertUserRole(long userSeq, long roleSeq, long createdBy);
```

### DTO

```java
// UsersSignupRequest
@Getter @Setter
@Schema(description = "회원 등록 요청")
public class UsersSignupRequest {

    @NotBlank(message = "아이디는 필수입니다.")
    @Schema(description = "사용자 아이디", example = "testuser")
    private String userId;

    @NotBlank(message = "이름은 필수입니다.")
    @Schema(description = "사용자 이름", example = "홍길동")
    private String userName;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Schema(description = "비밀번호", example = "password123")
    private String password;

    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    @Schema(description = "사용자 이메일", example = "user@example.com")
    private String userEmail;
}

// UsersSignupResponse
@Getter @Setter
@Schema(description = "회원 등록 응답")
public class UsersSignupResponse {

    @Schema(description = "생성된 회원 일련번호", example = "1")
    private Long seq;

    @Schema(description = "사용자 아이디", example = "testuser")
    private String userId;

    @Schema(description = "사용자 이름", example = "홍길동")
    private String userName;
}
```

---

## 이슈 1: 회원 등록 API 구현

**수직 슬라이스**: 이 이슈 완료 시 `POST /api/public/users` curl 가능

### 선행 작업 (이슈 내 포함)

1. Flyway 마이그레이션 파일 스테이징
   ```bash
   git add datasource/platform/flyway/V20260525100003__user_table.sql
   ```

2. JOOQ 코드 재생성
   ```bash
   ./gradlew :datasource:platform:generateJooq
   ```

3. AuthorityRepository 컬럼명 수정
   - `ROLES.USER_ROLE_NAME` → `ROLES.ROLE_NAME`

### 생성 파일

```
datasource/platform/src/main/java/com/platform/datasource/platform/repository/users/
  UsersRepository.java

api/platform/src/main/java/com/platform/api/platform/users/
  controller/UsersController.java
  service/UsersService.java
  dto/UsersSignupRequest.java
  dto/UsersSignupResponse.java
```

### 수정 파일

```
datasource/platform/src/main/java/com/platform/datasource/platform/repository/authority/
  AuthorityRepository.java  — ROLES.USER_ROLE_NAME → ROLES.ROLE_NAME
```

### Acceptance Criteria

- [x] Given 유효한 요청(userId, userName, password, userEmail), When POST /api/public/users, Then 201 + UsersSignupResponse (seq, userId, userName)
- [x] Given 이미 존재하는 userId, When POST /api/public/users, Then 409 + 에러 메시지
- [x] Given 이미 존재하는 userEmail, When POST /api/public/users, Then 409 + 에러 메시지
- [x] Given 필수 필드 누락 (userId/userName/password/userEmail 중 하나), When POST /api/public/users, Then 400 (Bean Validation)
- [x] Given 유효한 요청, When 가입 완료, Then users 테이블에 BCrypt 인코딩된 비밀번호로 저장
- [x] Given 유효한 요청, When 가입 완료, Then user_roles에 USER role (role_name='USER') 매핑 저장

---

## 테스트 시나리오

### Service 단위 테스트

- [x] [정상] `UsersService.signup` — should return `UsersSignupResponse(seq, userId, userName)` when 유효한 요청(userId, userName, password, userEmail) 전달
- [x] [정상] `UsersService.signup` — should encode password with BCrypt (stored password ≠ plain text) when 유효한 요청 전달
- [x] [정상] `UsersService.signup` — should call `insertUserRole` with USER role seq when 가입 성공 후
- [x] [예외] `UsersService.signup` — should throw `IllegalStateException` when userId가 이미 존재 (`existsByUserId` → true)
- [x] [예외] `UsersService.signup` — should throw `IllegalStateException` when userEmail이 이미 존재 (`existsByEmail` → true)
- [x] [예외] `UsersService.signup` — should throw `IllegalStateException` when userId 중복 시 userEmail 중복 체크·insertUser·insertUserRole을 호출하지 않음

### Controller 슬라이스 테스트

- [x] [정상] `UsersController.signup` — should return 201 + `{seq, userId, userName}` when 유효한 JSON 요청 전달
- [x] [예외] `UsersController.signup` — should return 400 when `userId` 필드 누락
- [x] [예외] `UsersController.signup` — should return 400 when `userName` 필드 누락
- [x] [예외] `UsersController.signup` — should return 400 when `password` 필드 누락
- [x] [예외] `UsersController.signup` — should return 400 when `userEmail` 필드 누락
- [x] [예외] `UsersController.signup` — should return 400 when `userEmail` 형식이 올바르지 않음 (non-email string)
- [x] [예외] `UsersController.signup` — should return 409 when `UsersService.signup`이 `IllegalStateException` throw (userId 중복)
- [x] [예외] `UsersController.signup` — should return 409 when `UsersService.signup`이 `IllegalStateException` throw (userEmail 중복)

### AC 커버리지

| AC | 커버 시나리오 |
|----|-------------|
| Given 유효한 요청, When POST /api/public/users, Then 201 + UsersSignupResponse(seq, userId, userName) | [정상] Service.signup — should return UsersSignupResponse, [정상] Controller.signup — should return 201 |
| Given 이미 존재하는 userId, When POST, Then 409 | [예외] Service.signup — should throw IllegalStateException when userId 중복, [예외] Controller.signup — should return 409 (userId 중복) |
| Given 이미 존재하는 userEmail, When POST, Then 409 | [예외] Service.signup — should throw IllegalStateException when userEmail 중복, [예외] Controller.signup — should return 409 (userEmail 중복) |
| Given 필수 필드 누락, When POST, Then 400 | [예외] Controller.signup — should return 400 when userId/userName/password/userEmail 누락 (4개 시나리오) + userEmail 형식 오류 |
| Given 유효한 요청, When 가입 완료, Then BCrypt 인코딩된 비밀번호 저장 | [정상] Service.signup — should encode password with BCrypt |
| Given 유효한 요청, When 가입 완료, Then user_roles에 USER role 매핑 | [정상] Service.signup — should call insertUserRole with USER role seq |

---

## AC 검증

검증일: 2026-06-25
결과: ✅ 모든 AC 충족 (6건)

## 리팩토링 결과
리팩토링일: 2026-06-25
완료: 0건 / 건너뜀: 0건

---

## 보안 검토

검토일: 2026-06-25

### 즉시 수정 필요 (처리 완료)
없음

### 권장 수정
없음

### 무시 가능
없음

### 클린 기준 충족
- [x] ./gradlew build -x test: 컴파일 오류 0건
- [x] ./gradlew test: 전체 통과 (14/14)
