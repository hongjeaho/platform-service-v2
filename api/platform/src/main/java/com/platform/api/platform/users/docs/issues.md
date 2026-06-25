# 회원 등록 이슈 목록

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

### 구현 상세

#### UsersRepository (datasource/platform)

```java
@Repository
public class UsersRepository {
    // existsByUserId(String userId) → boolean
    // existsByEmail(String email) → boolean
    // insertUser(UsersEntity user) → Long (seq)
    // findRoleSeqByName(String roleName) → Long
    // insertUserRole(long userSeq, long roleSeq, long createdBy)
}
```

#### UsersService (api/platform)

```java
@Service
public class UsersService {
    @PlatformTransactional
    public UsersSignupResponse signup(UsersSignupRequest request) {
        // 1. userId 중복 체크 → IllegalStateException
        // 2. userEmail 중복 체크 → IllegalStateException
        // 3. BCrypt 인코딩
        // 4. users 삽입 (created_by = 0L)
        // 5. roles 조회 (role_name='USER')
        // 6. user_roles 삽입
        // 7. UsersSignupResponse 반환
    }
}
```

#### UsersController (api/platform)

```java
@Tag(name = "회원", description = "회원 관리 API")
@RestController
public class UsersController {
    @PostMapping("/api/public/users")
    public ResponseEntity<ApiResponse<UsersSignupResponse>> signup(
        @RequestBody @Valid UsersSignupRequest request
    )
}
```

### Acceptance Criteria

- [ ] Given 유효한 요청(userId, userName, password), When POST /api/public/users, Then 201 + UsersSignupResponse (seq, userId, userName)
- [ ] Given 이미 존재하는 userId, When POST /api/public/users, Then 409 + 에러 메시지
- [ ] Given 이미 존재하는 userEmail, When POST /api/public/users, Then 409 + 에러 메시지
- [ ] Given 필수 필드 누락 (userId/userName/password/userEmail 중 하나), When POST /api/public/users, Then 400 (Bean Validation)
- [ ] Given 유효한 요청, When 가입 완료, Then users 테이블에 BCrypt 인코딩된 비밀번호로 저장
- [ ] Given 유효한 요청, When 가입 완료, Then user_roles에 USER role (role_name='USER') 매핑 저장

### 테스트 레이어

| 테스트 클래스 | 어노테이션 | Mock 대상 |
|-------------|-----------|---------|
| `UsersServiceTest` | `@ExtendWith(MockitoExtension.class)` | `UsersRepository` (`@Mock`) |
| `UsersControllerTest` | `@WebMvcTest(UsersController.class)` | `UsersService` (`@MockBean`) |

### TDD 실행 순서

```
/tdd-cycle-be 1
```

또는 단계별:

```
/test-scenarios-be 1   → Java 시그니처 확정 + 시나리오 도출
/tdd-red-be 1          → 실패 테스트 작성
/tdd-green-be 1        → 최소 구현 (JOOQ 재생성 포함)
/ac-verifier-be 1      → AC 충족 검증
/tdd-refactor-be 1     → 구조 개선
/security-review-be 1  → 보안 검토
/create-pr-be          → PR 생성
```
