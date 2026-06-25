# 회원 정보 조회 및 수정 API — 이슈 목록

## 이슈 개요
총 4개 이슈: 아이디 중복 확인, 이메일 중복 확인, 비밀번호 변경(로그인 전), 비밀번호 변경(로그인 후)

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
- [ ] Given 빈 값이 아닌 userId가 주어지고, When 중복 확인 요청하면, Then 200 OK와 available=true 응답
- [ ] Given 이미 존재하는 userId로 요청하면, Then 409 Conflict와 "이미 사용 중인 아이디입니다." 메시지
- [ ] Given 빈 userId로 요청하면, Then 400 Bad Request와 "userId는 필수입니다." 메시지
- [ ] Given 30자 초과 userId로 요청하면, Then 400 Bad Request와 "userId는 30자 이하여야 합니다." 메시지

### 의존성
없음 (Repository 메서드 기존 존재)

### 네이밍 (spec-fixed.md 준수)
- 클래스: `UserIdCheckRequest`, `CheckDuplicateResponse`
- 메서드: `checkId()`, `checkDuplicateUserId()`

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
- [ ] Given 빈 값이 아닌 userEmail이 주어지고, When 중복 확인 요청하면, Then 200 OK와 available=true 응답
- [ ] Given 이미 존재하는 userEmail로 요청하면, Then 409 Conflict와 "이미 사용 중인 이메일입니다." 메시지
- [ ] Given 빈 userEmail로 요청하면, Then 400 Bad Request와 "userEmail은 필수입니다." 메시지
- [ ] Given 이메일 형식이 아닌 userEmail로 요청하면, Then 400 Bad Request와 "이메일 형식이 올바르지 않습니다." 메시지
- [ ] Given 100자 초과 userEmail로 요청하면, Then 400 Bad Request와 "userEmail은 100자 이하여야 합니다." 메시지

### 의존성
없음 (Repository 메서드 기존 존재)

### 네이밍 (spec-fixed.md 준수)
- 클래스: `UserEmailCheckRequest`, `CheckDuplicateResponse`
- 메서드: `checkEmail()`, `checkDuplicateUserEmail()`

---

## 이슈 #3: 비밀번호 변경 API (로그인 전)

### 개요
로그인 전 이메일과 현재 비밀번호로 비밀번호를 변경하는 API를 구현합니다.

### 범위
- Controller: `UsersController.changePasswordBeforeLogin()` 엔드포인트 추가
- Service: `UsersService.changePasswordBeforeLogin()` 메서드 추가
- Repository: `findByUserEmail()` 신규 추가, `updatePassword()` 신규 추가
- DTO: `ChangePasswordBeforeLoginRequest`, `ChangePasswordResponse`

### Acceptance Criteria
- [ ] Given 존재하는 userEmail, 올바른 currentPassword, 유효한 newPassword(8~12자)가 주어지고, When 비밀번호 변경 요청하면, Then 200 OK와 success=true 응답, password_changed_time 갱신
- [ ] Given 존재하지 않는 userEmail로 요청하면, Then 400 Bad Request와 "해당 이메일로 등록된 사용자가 없습니다." 메시지
- [ ] Given 올바르지 않은 currentPassword로 요청하면, Then 400 Bad Request와 "현재 비밀번호가 일치하지 않습니다." 메시지
- [ ] Given currentPassword와 동일한 newPassword로 요청하면, Then 409 Conflict와 "현재 비밀번호와 동일합니다." 메시지
- [ ] Given 8자 미만 newPassword로 요청하면, Then 400 Bad Request와 "비밀번호는 8~12자리여야 합니다." 메시지
- [ ] Given 12자 초과 newPassword로 요청하면, Then 400 Bad Request와 "비밀번호는 8~12자리여야 합니다." 메시지
- [ ] Given 빈 userEmail/currentPassword/newPassword로 요청하면, Then 400 Bad Request와 필수 항목 메시지
- [ ] Given 올바르지 않은 이메일 형식으로 요청하면, Then 400 Bad Request와 "이메일 형식이 올바르지 않습니다." 메시지

### 의존성
없음 (단, UsersRepository에 메서드 2개 추가 필요)

### 네이밍 (spec-fixed.md 준수)
- 클래스: `ChangePasswordBeforeLoginRequest`, `ChangePasswordResponse`
- 메서드: `changePasswordBeforeLogin()`, `findByUserEmail()`, `updatePassword()`

---

## 이슈 #4: 비밀번호 변경 API (로그인 후)

### 개요
로그인 후 JWT 인증状态下에서 현재 비밀번호 확인 후 비밀번호를 변경하는 API를 구현합니다.

### 범위
- Controller: `UsersController.changePassword()` 엔드포인트 추가 (`/api/users/change-password`)
- Service: `UsersService.changePassword()` 메서드 추가
- Repository: `findBySeq()` 신규 추가, `updatePassword()` (이슈 #3에서 추가됨)
- DTO: `ChangePasswordRequest`, `ChangePasswordResponse`

### Acceptance Criteria
- [ ] Given JWT 토큰으로 인증된 상태, 올바른 currentPassword, 유효한 newPassword(8~12자)가 주어지고, When 비밀번호 변경 요청하면, Then 200 OK와 success=true 응답, password_changed_time 갱신
- [ ] Given JWT 없이 요청하면, Then 401 Unauthorized (SecurityConfig 자동 처리)
- [ ] Given 올바르지 않은 currentPassword로 요청하면, Then 400 Bad Request와 "현재 비밀번호가 일치하지 않습니다." 메시지
- [ ] Given currentPassword와 동일한 newPassword로 요청하면, Then 409 Conflict와 "현재 비밀번호와 동일합니다." 메시지
- [ ] Given 8자 미만 newPassword로 요청하면, Then 400 Bad Request와 "비밀번호는 8~12자리여야 합니다." 메시지
- [ ] Given 12자 초과 newPassword로 요청하면, Then 400 Bad Request와 "비밀번호는 8~12자리여야 합니다." 메시지
- [ ] Given 빈 currentPassword/newPassword로 요청하면, Then 400 Bad Request와 필수 항목 메시지

### 의존성
이슈 #3 (updatePassword() 메서드 재활용)

### 네이밍 (spec-fixed.md 준수)
- 클래스: `ChangePasswordRequest`, `ChangePasswordResponse`
- 메서드: `changePassword()`, `findBySeq()`

---

## 이슈 의존성 순서

```
이슈 #1 (아이디 중복 확인)
    ↓
이슈 #2 (이메일 중복 확인)
    ↓
이슈 #3 (비밀번호 변경 - 로그인 전) → UsersRepository에 findByUserEmail(), updatePassword() 추가
    ↓
이슈 #4 (비밀번호 변경 - 로그인 후) → updatePassword() 재활용, findBySeq() 추가
```

## 수직 슬라이스 검증

| 이슈 | 완료 시 curl 가능 여부 | AC 수 |
|------|---------------------|------|
| #1 | ✅ POST /api/public/users/check-id | 4 |
| #2 | ✅ POST /api/public/users/check-email | 5 |
| #3 | ✅ POST /api/public/users/change-password | 9 |
| #4 | ✅ POST /api/users/change-password | 7 |

## 테스트 레이어

각 이슈는 아래 두 레이어 테스트로 커버:

| 레이어 | 어노테이션 | 테스트 대상 | Mock 대상 |
|--------|-----------|-----------|---------|
| Service 단위 테스트 | `@ExtendWith(MockitoExtension.class)` | 비즈니스 로직, 예외 | Repository (`Mockito.mock`) |
| Controller 슬라이스 테스트 | `@WebMvcTest` | HTTP 요청/응답, 상태코드 | Service (`@MockBean`) |
