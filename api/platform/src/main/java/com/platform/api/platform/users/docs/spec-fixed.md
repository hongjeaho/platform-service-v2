# 회원 정보 조회 및 수정 API 정의서 (확정)

## 기능 개요
회원가입 전 아이디/이메일 중복 확인, 로그인 전/후 비밀번호 변경 기능을 제공합니다.

## 기능 요구사항
- id 중복 여부 확인
- email 중복 여부 확인
- password 변경 (로그인 전: 이메일만으로 / 로그인 후: 현재 비밀번호 확인)

## 제약사항
- 기존 API는 수정하지 않습니다.

## 용어 정의

| 용어 | 설명 | 코드 네이밍 |
|------|------|------------|
| 사용자 | 시스템 이용자, users 테이블의 레코드 | `User`, `user` |
| 아이디 | 사용자 로그인 ID (user_id 컬럼) | `userId` |
| 이메일 | 사용자 이메일 (user_email 컬럼) | `userEmail`, `email` |
| 비밀번호 | 사용자 비밀번호 (user_password 컬럼) | `userPassword`, `password` |
| 중복 확인 | id/email 이미 사용 중인지 검사 | `checkDuplicate`, `existsBy` |
| 비밀번호 변경 | 사용자 비밀번호 수정 | `changePassword`, `updatePassword` |
| 사용 가능 | 중복 아님, 회원가입 가능 상태 | `available` |
| 중복 | 이미 사용 중인 상태 | `duplicate`, `exists` |

## 인터뷰 확정 사항

### Primary User
- 일반 사용자

### 참고 레퍼런스
- 없음

### 의존 기존 기능
- `users` 테이블 (기존 존재)
- `UsersRepository` (existsByUserId, existsByEmail 메서드 존재)

### 최소 동작 시나리오

**시나리오 1: id 중복 확인**
1. 클라이언트가 id 중복 확인 요청
2. Service에서 Repository.existsByUserId() 호출
3. 사용 가능(200) 또는 중복(409) 응답

**시나리오 2: email 중복 확인**
1. 클라이언트가 email 중복 확인 요청
2. Service에서 Repository.existsByEmail() 호출
3. 사용 가능(200) 또는 중복(409) 응답

**시나리오 3-A: password 변경 (로그인 전)**
1. 클라이언트가 이메일 + 현재 비밀번호 + 새 비밀번호로 요청
2. Service에서 해당 이메일 사용자 조회
3. 현재 비밀번호 검증 (BCrypt)
4. 새 비밀번호로 변경 (password_changed_time 갱신)
5. 성공(200) 응답

**시나리오 3-B: password 변경 (로그인 후)**
1. 클라이언트가 JWT 토큰 + 현재 비밀번호 + 새 비밀번호로 요청
2. UserAccountHolder.getSeqNo()로 현재 사용자 조회
3. 현재 비밀번호 검증 (BCrypt)
4. 새 비밀번호가 현재와 동일한지 검증
5. 새 비밀번호로 변경 (password_changed_time 갱신)
6. 성공(200) 응답

### 경계 조건 (모범 사례 기준)

| 항목 | 조건 |
|------|------|
| id 빈 값 | 400 Bad Request (@NotBlank) |
| id 최대 길이 | 30자 (테이블 제약 준수) |
| email 빈 값 | 400 Bad Request (@NotBlank, @Email) |
| email 최대 길이 | 100자 (테이블 제약 준수) |
| password 최소 길이 | 8자 (@Size(min=8)) |
| password 최대 길이 | 12자 (@Size(max=12)) |
| 동시성 중복 확인 | DB UNIQUE 제약조건으로 자동 처리 |
| password 변경 간격 | 제한 없음 |

### 에러 처리 (ApiResponse 통일)

| 상황 | HTTP | 응답 메시지 |
|------|------|------------|
| id/email 빈 값 | 400 | `{항목명}은 필수입니다.` |
| id/email 중복 | 409 | `이미 사용 중인 {항목명}입니다.` |
| id/email 사용 가능 | 200 | `사용 가능합니다.` |
| 해당 이메일 사용자 없음 (로그인 전 변경) | 400 | `해당 이메일로 등록된 사용자가 없습니다.` |
| 현재 비밀번호 불일치 | 400 | `현재 비밀번호가 일치하지 않습니다.` |
| 새 비밀번호가 현재와 동일 | 409 | `현재 비밀번호와 동일합니다.` |
| 비밀번호 길이 위반 | 400 | `비밀번호는 8~12자리여야 합니다.` |
| 이메일 형식 위반 | 400 | `이메일 형식이 올바르지 않습니다.` |

### 기존 백엔드 패턴 일관성

**Helper 추출 계획**: 없음
- Service 단독 처리 가능
- 중복 확인: Repository 메서드 직접 호출
- 비밀번호 검증: Service에서 단순 if문으로 처리
- 비즈니스 로직이 단순하여 Service 코드가 200줄 초과 예상 안 됨

### 성능 제약

| 항목 | 기준 |
|------|------|
| id/email 중복 확인 응답 시간 | 목표: 100ms 이내 |
| password 변경 응답 시간 | 목표: 200ms 이내 (BCrypt 해싱 포함) |
| 캐시 적용 | 불필요 (실시간 중복 체크 필요) |

### 접근 권한

| 기능 | 경로 | 인증 여부 | 비고 |
|------|------|---------|------|
| id 중복 확인 | `/api/public/users/check-id` | 불필요 | 회원가입 전 단계 |
| email 중복 확인 | `/api/public/users/check-email` | 불필요 | 회원가입 전 단계 |
| password 변경 (로그인 전) | `/api/public/users/change-password` | 불필요 | 이메일만으로 변경 |
| password 변경 (로그인 후) | `/api/users/change-password` | JWT 필요 | UserAccountHolder.getSeqNo() 사용 |

### 향후 확장 가능성

| 확장 기능 | 영향 여부 | 대응 방안 |
|----------|----------|---------|
| 이메일 인증 도입 (로그인 전 password 변경) | ✅ 영향 있음 | 추후 인증 코드 검증 로직 추가 시 API 변경 필요 |
| 비밀번호 복잡도 강화 (영문/숫자/특수문자 조합) | ✅ 영향 있음 | Bean Validation에 정규식 추가 |
| 비밀번호 변경 간격 제한 도입 | ✅ 영향 있음 | password_changed_time 활용 로직 추가 |
| 계정 잠금 기능 (비밀번호 실패 횟수) | ✅ 영향 있음 | 별도 테이블 또는 컬럼 필요 |
| 회원 정보 조회 API 추가 | ✅ 영향 있음 | users 테이블 활용 |

### 보안 고지사항
⚠️ 로그인 전 이메일만으로 비밀번호 변경은 보안상 취약합니다. 추후 이메일 인증 기능 도입을 권장합니다.
