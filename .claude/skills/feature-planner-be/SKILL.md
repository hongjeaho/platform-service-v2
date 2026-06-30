---
name: feature-planner-be
description: |
  백엔드(Spring Boot) 아이디어를 이슈 단위로 변환하는 기획 워크플로우. 아이디어→spec→prd→issues 파이프라인.
  "백엔드 기획"·"API 설계"·"feature-planner-be"·"백엔드 이슈 분해" 언급 시 이 스킬 사용.
---

# Feature Planning Workflow [백엔드 · Spring Boot]

아이디어에서 개발 가능한 이슈 단위로 변환하는 기획 파이프라인.
각 GATE에서 사용자의 명시적 승인을 받아야 다음 단계로 진행한다. 승인 없이 자동으로 앞서 나가지 않는다.

> **패턴 기준**: `CLAUDE.md`의 레이어 책임·네이밍·트랜잭션 규칙.
> 기존 구현체가 필요하면 동일 모듈에서 가장 완성도 높은 도메인을 탐색해 참고하되,
> 특정 도메인을 고정 기준으로 삼지 않는다.

---

## 브랜치 기반 경로 자동 추론

### 입력 형식

```
/feature-planner-be                                    ← 현재 브랜치에서 자동 추론
/feature-planner-be {기능 설명}                        ← 현재 브랜치 + 설명 추가
/feature-planner-be {root}/{feature-path}             ← 경로 직접 지정
/feature-planner-be {root}/{feature-path} {설명}      ← 경로 + 설명
```

### Step 1: 현재 브랜치 확인

```bash
git branch --show-current
```

### Step 2: 보호 브랜치 감지 → 브랜치 생성 프로세스

브랜치명이 `main`, `master`, `develop`, `dev` 중 하나이거나 `feature/` prefix가 없는 경우
→ 기획 전에 브랜치를 먼저 만든다.

```
⚠️  현재 브랜치: main (보호 브랜치)
    기획 문서와 이후 코드 작업은 feature 브랜치에서 진행해야 합니다.

    기능명을 알려주시면 브랜치명을 제안해드릴게요.
    예) "공지 목록"       → feature/notice/list
        "태그 관리"       → feature/tag
        "공지 검색 조건"  → feature/notice/list-search
```

사용자가 기능명을 입력하면:

1. **브랜치명 제안**
   ```
   제안 브랜치명: feature/{feature-path}

   ✅ 이 이름으로 생성할까요?
      변경하려면 원하는 이름을 입력해주세요.
   ```

2. **사용자 확인 후 브랜치 생성 명령어 제시**
   > Claude는 git 명령을 직접 실행하지 않는다. 사용자가 직접 실행하도록 명령어를 제시한다.
   ```bash
   git checkout -b feature/notice/list
   ```
   ```
   위 명령어를 실행하신 후 "완료"라고 말씀해주세요.
   ```

3. **사용자가 "완료" 응답 시** → Step 2.5로 진행

### Step 2.5: 루트 결정 + 모듈 감지 + 패키지 루트 탐색

브랜치명에서 **root**를 추출한 후 해당 루트 디렉토리를 스캔해 module-name을 결정하고,
**실제 패키지 루트를 파일시스템에서 탐색**해 경로를 확정한다.

#### 2.5-A: 루트 결정 + 모듈 선택

```bash
# root 추출은 Step 3에서 처리
# 여기서는 root가 결정되었다고 가정

ls {root}/
```

| {root}/* 디렉토리 수 | 처리 |
|---------------------|-----|
| 1개 | 자동 선택 후 사용자에게 확인 메시지 출력 |
| 2개 이상 | 사용자에게 선택 질문 |

**root별 예시:**

| root | module-name 예시 | 전체 경로 |
|------|-----------------|-----------|
| api | users, platform, admin | `api/users/`, `api/platform/`, `api/admin/` |
| common | core, jooq, web | `common/core/`, `common/jooq/`, `common/web/` |
| datasource | users, platform | `datasource/users/`, `datasource/platform/` |

**단일 모듈 (예: api/users):**
```
📦 루트: api
📦 모듈: users (api/users + datasource/users)
   이 모듈로 진행합니다. 다르면 말씀해주세요.
```

**복수 모듈 (예: api에 users, platform, admin 존재):**
```
📦 루트: api
📦 감지된 모듈: users, platform, admin
   어떤 모듈의 기능인가요?
   예) users → api/users + datasource/users
       platform → api/platform + datasource/platform
```

#### 2.5-B: 패키지 루트 자동 탐색 (module-name 확정 후 즉시 실행)

`Application.java`(또는 `*Application.java`) 위치로 실제 패키지 루트를 결정한다.
패키지 이름은 모듈마다 다를 수 있으므로 **절대 하드코딩하지 않는다.**

```bash
find api/{module-name}/src/main/java -name "*Application.java" -maxdepth 8 | head -1
```

예) 결과: `api/platform/src/main/java/com/platform/api/platform/ApiPlatformApplication.java`
→ `Application.java`를 제외한 디렉토리 = **pkg-root**: `com/platform/api/platform`

탐색 실패(파일 없음) 시 사용자에게 직접 입력 요청:
```
⚠️  패키지 루트를 자동으로 찾지 못했습니다.
    src/main/java 아래의 기본 패키지 경로를 알려주세요.
    예) com/platform/api/platform
```

### Step 3: 브랜치 → root + feature-path 변환 규칙

> **브랜치 컨벤션**
> ```
> feature/{root}/{feature-path}
>        └─ api | common | datasource
> ```
> - `/` : 계층 구분자 (도메인/기능/하위기능)
> - `-` : 같은 계층 내 단어 연결

| 브랜치명 | root | feature-path | 문서 경로 (pkg-root 예시) |
|---------|------|--------------|---------------------------|
| `feature/api/users/이메일-인증` | api | `users/이메일-인증` | `api/users/src/main/java/{pkg-root}/users/이메일-인증/docs/` |
| `feature/common/core/email` | common | `core/email` | `common/core/src/main/java/{pkg-root}/core/email/docs/` |
| `feature/datasource/users/user` | datasource | `users/user` | `datasource/users/src/main/java/{pkg-root}/users/user/docs/` |
| `feature/api/tag` | api | `tag` | `api/{module}/src/main/java/{pkg-root}/tag/docs/` |

**변환 알고리즘:**
1. `feature/` prefix 제거
2. 첫 번째 `/`까지를 **root**로 추출 (api | common | datasource)
3. 나머지를 **feature-path**로 사용 (슬래시·하이픈 변환 없음)

**예시 변환:**
```
feature/api/users/이메일-인증
  ↓ feature/ 제거
api/users/이메일-인증
  ↓ 첫 /까지 추출
root: api
feature-path: users/이메일-인증
```

### Step 3.5: docs 폴더 검증

feature-path 추출 후 실제 docs 폴더가 존재하는지 검증한다.

```bash
# docs 폴더 존재 확인
find {root}/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/ -type d 2>/dev/null
```

**검증 결과:**

| 결과 | 처리 |
|------|------|
| docs 폴더 존재 | 정상 진행 (신규 또는 기존 spec.md 처리) |
| docs 폴더 없음 | 신규 기능으로 간주, 단계 0에서 spec.md 생성 |

**검증 실패 시 에러 메시지 (보호 브랜치 또는 경로 불일치):**

```
⛔ feature-path 검증 실패

   브랜치: feature/api/users/이메일-인증
   추론된 root: api
   추론된 feature-path: users/이메일-인증
   확인된 경로: api/users/src/main/java/com/platform/api/users/users/이메일-인증/docs/

   문제: docs 폴더를 찾을 수 없습니다.

   해결책:
   1. 브랜치명이 올바른지 확인하세요
   2. 직접 경로를 지정하세요: /feature-planner-be users/이메일-인증
```

### Step 4: 추론 결과 사용자에게 확인

```
🌿 현재 브랜치: feature/api/users/이메일-인증
📦 루트:       api
📦 모듈:       users (api/users + datasource/users)
📦 패키지 루트: com/platform/api/users
📁 추론된 경로: users/이메일-인증
   → 문서 경로: api/users/src/main/java/com/platform/api/users/users/이메일-인증/docs/

경로가 맞으면 계속 진행합니다. 다르면 말씀해주세요.
```

### Step 5: 컨텍스트 저장

```
[CONTEXT] root:         api
          feature-path: users/이메일-인증
          module-name:  users
          api-module:   api/users
          ds-module:    datasource/users
          pkg-root:     com/platform/api/users
          docs-root:    api/users/src/main/java/com/platform/api/users/users/이메일-인증/docs/
          branch:       feature/api/users/이메일-인증
```

---

## 경로 네이밍 규칙 (직접 지정 시)

직접 경로를 입력할 때의 형식 (브랜치 추론이 실패하거나 override할 때 사용).

```
/feature-planner-be {root}/{feature-path}
/feature-planner-be {root}/{feature-path} {기능 설명}
```

| 입력 예시 | 의미 | 문서 경로 (module-name=users) |
|----------|------|--------------------------------|
| `/feature-planner-be api/tag` | api 하위 tag 단독 기능 | `api/{module}/src/main/java/.../tag/docs/` |
| `/feature-planner-be api/users/이메일-인증` | api/users 하위 이메일 인증 | `api/users/src/main/java/.../users/이메일-인증/docs/` |
| `/feature-planner-be common/core/email` | common/core 하위 email | `common/core/src/main/java/.../core/email/docs/` |
| `/feature-planner-be api/users/인증 페이지네이션 포함` | 설명 추가 | `api/users/src/main/java/.../users/인증/docs/` |

**파싱 규칙:**
- 첫 토큰에 슬래시(`/`)가 있고 root로 시작 → `{root}/{feature-path}` 직접 지정
  - root 패턴: `api/*`, `common/*`, `datasource/*`
- 첫 토큰이 한글이거나 자연어 문장 → `{기능 설명}`으로 판단 → 브랜치 추론 실행
- 입력 없음 → 브랜치 추론 실행

### 산출물 경로

```
{root}/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/
```

`{root}`는 Step 3에서 추출 (api | common | datasource).
`{pkg-root}`는 Step 2.5-B에서 `*Application.java` 위치로 자동 탐색한 패키지 경로.
피처 코드와 같은 위치에 co-location.
Gradle은 `src/main/java/`에서 `.java`만 컴파일하므로 `.md` 파일은 무시된다.

---

---

## 스킬 진입 즉시 실행 순서

> **Claude는 스킬이 호출되면 사용자 응답을 기다리지 않고 아래 명령을 즉시 실행한다.**
> 각 명령 결과를 토대로 다음 명령을 실행하고, 모두 완료된 후 단계 0 안내를 출력한다.

```bash
# 1. 현재 브랜치 확인
git branch --show-current

# 2. 브랜치에서 root + feature-path 추출
#    예: feature/api/users/이메일-인증 → root=api, feature-path=users/이메일-인증

# 3. 루트 디렉토리 스캔 (root가 결정된 후 실행)
ls {root}/

# 4. 패키지 루트 탐색 (module-name이 결정된 후 실행)
find {root}/{module-name}/src/main/java -name "*Application.java" -maxdepth 8 | head -1

# 5. spec.md 존재 여부 확인 (root, module-name, pkg-root, feature-path가 결정된 후 실행)
ls {root}/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/spec.md 2>/dev/null
```

---

## 단계 0: 진입 조건 검증

### 경로 확정 안내

스킬 진입 직후 파싱/추론 결과를 아래 형식으로 사용자에게 먼저 보여준다.

```
🌿 브랜치: feature/api/users/이메일-인증
📦 루트:   api
📦 모듈:   users (api/users + datasource/users)
📦 패키지: com/platform/api/users
📁 문서 경로: api/users/src/main/java/com/platform/api/users/users/이메일-인증/docs/

변경이 필요하면 말씀해주세요. 없으면 계속 진행합니다.
```

### spec.md 처리 — 3가지 경우 분기

#### 경우 A: spec.md가 이미 있음

파일을 읽어 내용을 사용자에게 그대로 보여주고 아래 메시지를 출력한다.

```
📄 기존 spec.md를 찾았습니다.
─────────────────────────────
{spec.md 내용}
─────────────────────────────
이 내용으로 진행할까요? 수정이 필요하면 말씀해주세요.
```

#### 경우 B: spec.md 없음 + 기능 설명 있음

호출 시 전달된 설명으로 `spec.md`를 즉시 생성하고 보여준다.

```markdown
# {기능명} 정의서

## 기능 개요
{설명에서 추출한 기능 목적. 한두 문장.}

## 기능 요구사항
{설명에서 추출한 사용자 행동 목록}

## 제약사항
{설명에서 추출한 제한 조건. 없으면 "없음".}
```

#### 경우 C: spec.md 없음 + 기능 설명도 없음

**한 번에 하나씩** 아래 3문항을 질문한다.

```
[질문 1] 이 기능의 목적이 무엇인가요?
예) "게시글에 태그를 붙여서 카테고리처럼 필터링에 활용"
```
```
[질문 2] 누가 사용하나요?
예) 일반 사용자 / 관리자 / 시스템 내부
```
```
[질문 3] 핵심 동작을 한 줄로 표현하면?
예) "태그 추가·삭제·목록 조회 REST API"
```

3문항 완료 후 경우 B와 동일하게 `spec.md`를 생성하고 확인받는다.

### 진입 조건 체크리스트

- [ ] 기능 개요가 작성되어 있다
- [ ] 요구사항이 1개 이상 존재한다
- [ ] 제약사항이 작성되어 있다

---

## 단계 1: 요구사항 인터뷰

### 목적

spec.md의 모호성을 제거하고 엣지 케이스·결정 사항을 확정한다.
인터뷰 전에 코드베이스를 탐색해 아래 인프라 현황을 파악하고 결과를 기록한다.

### 백엔드 인프라스트럭처 인벤토리

인터뷰 전 탐색 대상:
- `{root}/{module-name}/{domain}/service/helper/` — Helper 컴포넌트 (root=api인 경우)
- `datasource/{module-name}/repository/`, `datasource/{module-name}/mapper/` — 데이터 접근
- `api/{module-name}/config/cache/CacheNames.java`, `CacheConfig.java` — 캐시 (root=api인 경우)
- `api/{module-name}/config/exception/GlobalExceptionHandler.java` — 예외 처리 (root=api인 경우)

**Helper 컴포넌트 현황**

| Helper 클래스 | 역할 접미사 | 이 기능에서 재사용 가능성 |
|-------------|-----------|----------------------|
| {HelperClassName} | Validator / Calculator / Converter / Sender / Builder / Processor | 높음 / 낮음 / 해당없음 |

> ※ `{Domain}Reader`는 Helper가 아닌 Service 레이어 컴포넌트 (`@Service`, Repository 주입 허용, `@PlatformTransactional(readOnly=true)`). 위 목록과 별도로 기록.
> **Reader 사용 기준**: 아래 중 하나에 해당할 때만 도입한다.
> - 복수 Repository를 조합하는 복잡한 조회 로직이 Service에 포함되어 SRP를 침해하는 경우
> - 조회 전용 로직이 Service를 200줄 초과하게 만드는 경우
> - 아키텍처 안 C(CQRS-lite) 선택 시 ReadService가 조회를 Reader에 위임하는 경우
> 단순 findById · findAll 수준의 조회는 Service에서 Repository를 직접 호출한다.

Helper가 없으면 "현재 없음 — 이 기능에서 첫 Helper 생성 여부 결정 필요"로 표기.

**JOOQ Repository / MyBatis Mapper 현황**

| Repository/Mapper | 주요 메서드 | 이 기능에서 재사용 가능성 |
|------------------|-----------|----------------------|
| {RepositoryName} | findAll, findById, save... | 높음 / 낮음 / 해당없음 |

**CacheNames 현황**

| 상수 이름 | 만료 정책 | 이 기능에서 활용 가능성 |
|---------|---------|----------------------|
| {CACHE_NAME_CONSTANT} | write=10m, access=30m, max=2000 | 높음 / 낮음 / 해당없음 |

**Exception 계층 현황** — 아래는 고정값 (GlobalExceptionHandler 기반)

| 예외 | HTTP | 사용 시점 |
|-----|------|---------|
| `IllegalArgumentException` | 400 | 조회 실패, 잘못된 입력 |
| `IllegalStateException` | 409 | 상태 충돌, 중복 |
| `@Valid` 자동 처리 | 400 | Bean Validation 실패 |
| `DataAccessException` 자동 처리 | 503 | DB 오류 |

이 목록이 인터뷰 질문 7번과 PRD "백엔드 아키텍처 준수 계획" 섹션의 입력이 된다.

### 인터뷰 방식

**한 번에 하나의 질문만 한다.** 사용자가 답하면 다음 질문으로 넘어간다.
추천 방식이 있으면 이유와 함께 제시한다.
spec.md에 이미 명확히 답변된 영역은 건너뛴다.
모든 영역이 다뤄지면 인터뷰를 종료한다.

**질문 영역 (맥락 → 동작 → 기술 → 보안/인증 → 미래 순):**

[맥락]
1. 이 기능의 primary user는 누구인가? (일반 사용자 / 관리자 / 시스템 내부 호출)
2. 참고할 API 스펙이나 레퍼런스가 있는가? (Swagger 문서, 유사 서비스, Figma 화면)
3. 의존하는 기존 기능은 무엇인가? (기존 테이블, 다른 도메인 Service와의 관계)

[동작 정의]
4. 최소 동작 시나리오 3개는? (가장 기본적인 API 호출 흐름)
5. 경계 조건 — 최대값, 빈 값, 중복, 동시성은?
6. 에러 처리 — 실패 시 클라이언트에 어떻게 표시하는가?

[기술 제약]
7. 기존 백엔드 패턴과의 일관성 — 이 기능의 비즈니스 로직이 기존 Helper
   (Validator/Calculator 등)로 해결 가능한가, 아니면 새 Helper가 필요한가?
   기존 도메인 패턴(Controller→Service→Repository)에서 벗어난다면 그 이유는?
   Service 코드가 200줄을 초과하거나 private 메서드가 5개 이상 생길 것 같으면
   미리 Helper 분리 계획을 세운다.
8. 성능 제약 — 허용 응답 시간, 페이지 크기, 대량 데이터 처리 여부는?

[보안/인증]
9. 이 API 엔드포인트의 접근 권한은?
   - 인증 불필요 → `/api/public/{domain}/**` 경로 사용, **`Public{Domain}Controller`** 명명
   - JWT 인증 필요 → `/api/{domain}/**` 경로, `UserAccountHolder.getSeqNo()`로 현재 사용자 조회, **`{Domain}Controller`** 명명
   - 역할 기반 제한 → `@PreAuthorize("hasAuthority('ADMIN')")` 적용, **`Admin{Domain}Controller`** 명명
   참고: `SecurityConfig.java`의 `requestMatchers` 패턴

### Controller 네이밍 규칙

| 접근 권한 | 경로 | Controller 명 | 예시 |
|----------|------|---------------|------|
| 인증 불필요 | `/api/public/{domain}/**` | `Public{Domain}Controller` | `PublicAuthController`, `PublicUsersController` |
| JWT 인증 필요 | `/api/{domain}/**` | `{Domain}Controller` | `NoticeListController` |
| ADMIN 전용 | `/api/admin/{domain}/**` | `Admin{Domain}Controller` | `AdminUsersController` |

[미래]
10. 향후 확장 가능성 — 이 결정이 다음 feature에 영향을 주는가?

### 산출물: spec-fixed.md

인터뷰 내용을 반영해 `spec-fixed.md`를 작성한다.
반드시 아래 "용어 정의" 섹션을 포함한다. 이 용어표가 이후 모든 코드·이슈·PR·커밋 메시지의 기준이 된다.

```markdown
## 용어 정의

| 용어 | 설명 | 코드 네이밍 |
|------|------|------------|
| {용어} | {설명} | `PascalCase` / `camelCase` |
```

**용어 정의 규칙 (Java/Spring):**
- 도메인 클래스명: PascalCase (예: `Notice`, `NoticeList`)
- Service 메서드명: camelCase 동사+명사 (예: `createNotice`, `deleteNotice`)
- DTO 클래스명: PascalCase + 역할 명시 (예: `NoticeCreateRequest`, `NoticeDetailResponse`)
- Helper 클래스명: `{Domain}{Description}{Role}` (예: `NoticeStatusValidator`, `NoticePriceCalculator`)
- Entity 클래스명: `{TableName}Entity` — JOOQ 자동 생성, 수동 수정 금지 (예: `BoardContentEntity`)
- Repository 메서드명: camelCase (예: `findById`, `save`, `countAll`)
- 동의어 사용 금지 — notice/post/board 중 하나를 선택하면 나머지는 코드에서 쓰지 않는다
- 용어가 바뀌어야 한다면 spec-fixed.md를 먼저 수정하고 코드를 따라 바꾼다

### [GATE] 단계 1 → 단계 2

```
[GATE] spec-fixed.md를 사용자에게 보여주고
       긍정 응답(yes / ok / 확인 / 좋아)을 받을 때까지 대기.
       긍정 응답 전까지 단계 2를 시작하지 않는다.
```

---

## 단계 2: PRD 작성 + 기술 결정(ADR)

### 목적

요구사항·API 명세·기술 결정·범위를 `prd.md` 하나로 통합한다.
"이 기능에 대해 궁금하면 여기만 보면 된다"는 단일 기준점을 만드는 것이 목표다.
이 PRD의 API 명세가 프론트엔드 Orval 코드 생성의 기준이 된다.

### 2-1. PRD 뼈대 생성

기술 결정 섹션은 TODO로 비워두고 나머지를 먼저 작성한다.

```markdown
# {기능명} PRD

## 개요
{기능 목적, 노출 엔드포인트, 호출 주체, 해결 비즈니스 문제 — 한 단락}

## 사용자 스토리
- As a {역할}, I want to {HTTP 행동}, so that {목적}

## API 명세
> API 변경 시 프론트엔드 `pnpm orval` 재실행 필요.

| HTTP | URI | 인증 | 요청 DTO | 응답 DTO |
|------|-----|-----|---------|---------|
| POST | /api/public/{domain} | 불필요 | {Domain}CreateRequest | {Domain}Response |
| GET  | /api/public/{domain}/{id} | 불필요 | — | {Domain}Response |
| PUT  | /api/{domain}/{id} | JWT 필요 | {Domain}UpdateRequest | {Domain}Response |
| DELETE | /api/{domain}/{id} | JWT 필요 | — | — (204) |

## 백엔드 아키텍처 준수 계획

**영향 범위**: `{root}/{module-name}` (Controller·Service·DTO·Helper) + `datasource/{module-name}` (Repository·Flyway)

**Helper**: Service 200줄 초과 or private 5개 이상 → 추출. Repository 주입·트랜잭션 금지.
| Helper 클래스 | 역할 접미사 | 추출 이유 |
|-------------|-----------|---------|
| — | Validator / Calculator / Converter | — |

**예외**: Controller try-catch 금지. `IllegalArgumentException`(400) / `IllegalStateException`(409).

**캐시**: CacheNames 상수로만 참조. 불필요 시 "캐시 없음 — 이유: {이유}" 명시.

**DB**: JOOQ 기본. 스키마 변경 시 `flyway/V{yyyyMMddHHmmss}__....sql` → `generateJooq`.

## 기술 결정
TODO — 2-3에서 ADR 작성 예정

## Out of Scope
TODO — 2-4에서 작성 예정

## 용어 정의
{spec-fixed.md에서 동기화}
```

### 2-2. 아키텍처 3안 제안 & 비교

코드베이스의 기존 패턴을 먼저 탐색한 뒤, 최소 3가지 구현 안을 제안하고
아래 **8가지 고정 기준**으로 비교표를 작성한다.

| # | 기준 | 설명 |
|---|------|------|
| 1 | 도메인 모델/DB 스키마 | Entity 설계, 테이블 관계, JOOQ 자동 생성 클래스명 (`J{Name}`, `{Name}Entity`) |
| 2 | REST API 설계 | URI 구조, HTTP 메서드, 요청/응답 DTO 형태, @Auditing 필요 여부 |
| 3 | Service/Helper 분리 여부 | Service 단독 처리 vs Helper 추출 (어떤 Role 접미사의 Helper가 생기는가) |
| 4 | DB 접근 전략 | JOOQ Repository 단독 / MyBatis Mapper 도입 / Flyway 마이그레이션 필요 여부 |
| 5 | 트랜잭션 경계 | `@PlatformTransactional` 적용 단위. 하나의 UseCase = 하나의 트랜잭션 메서드 |
| 6 | 캐시 전략 | Caffeine 적용 여부, CacheNames 신규 상수 필요 여부, evict 시점 |
| 7 | 테스트 용이성 | Service 단위 테스트(Mock Repository) 용이성, @WebMvcTest Controller 테스트 용이성 |
| 8 | 구현 복잡도/예상 공수 | Flyway 마이그레이션 포함 전체 공수. 팀 역량과 일정 기준 현실적인가 |

> **8번 기준을 포함하는 이유:** 가장 우아한 아키텍처가 항상 최선은 아니다.
> 팀 역량과 일정을 반영해야 실제로 완성된다.

**3안 예시 패턴:**

```
안 A: 단순 CRUD — Controller → Service → JOOQ Repository. Helper/캐시 없음.
  채택: 비즈니스 규칙 단순, 조회 빈도 낮음

안 B: Validator Helper 추출 — Service → [{Domain}Validator + Repository]. 읽기 캐시(@Cacheable) 적용.
  채택: 비즈니스 규칙 존재, Service 200줄 초과 예상

안 C: CQRS-lite — ReadService + WriteService 분리. Reader(@Service, Repository 주입 허용). MyBatis 복잡 집계.
  채택: 조회 압도적 다수, 통계/집계 복잡
```

```
[GATE] 사용자가 3안 중 하나를 선택할 때까지 대기.
       선택 전까지 2-3을 시작하지 않는다.
```

### 2-3. ADR 작성 (PRD "기술 결정" 섹션에 삽입)

선택한 안을 아래 4요소 형식으로 기록한다.

```markdown
### {결정 제목}

**Context** — 이 결정이 필요한 맥락. 무엇을 풀고 있는가.
**Decision** — 무엇을 선택했는가.
**Alternatives** — 거부한 안과 각각의 거부 이유. (이유 없는 거부 금지)
**Consequences** — 트레이드오프. 장점뿐 아니라 단점도 반드시 명시한다.
```

### 2-4. Out of Scope 작성

"이번에 하지 않을 것"을 구체적으로 나열한다.
Out of Scope가 없으면 AI가 맥락을 확장 해석해 범위 초과 구현이 발생한다.
예: "페이지네이션 커서 방식 전환", "태그 자동 추천", "Elasticsearch 연동" 등

```
[GATE] Out of Scope를 사용자에게 보여주고
       긍정 응답(yes / ok / 확인 / 좋아)을 받을 때까지 대기.
       긍정 응답 전까지 단계 3을 시작하지 않는다.
```

### 산출물

- `{root}/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/prd.md`

---

## 단계 3: 이슈 분해

### 목적

PRD를 실행 가능한 작업 단위로 변환한다.
각 이슈는 독립적으로 구현·테스트할 수 있어야 한다.

### 수직 슬라이싱 원칙

> "이 이슈만 완료하면 Swagger UI 또는 curl로 호출 가능한 REST 엔드포인트가 생기는가?"

- **Yes** → 올바른 수직 슬라이스
- **No** → 다른 이슈와 합치거나 다시 나눈다

**HTTP 동사 기반 수직 슬라이싱 — 권장 패턴:**

각 이슈는 HTTP 동사 1개 = API 엔드포인트 1개를 기준으로 분해하며,
해당 엔드포인트가 동작하기 위한 모든 레이어(Flyway + Repository + Service + Controller)를 포함한다.

```
수직 슬라이스 ✅ (이슈마다 완전한 요청·응답 흐름):

이슈 1: POST /api/public/tag  (태그 생성)
        → Flyway(V{ts}__create_tag_table.sql) + JOOQ 재생성
          + TagRepository.save() + TagService.createTag() + TagController.create()

이슈 2: GET /api/public/tag/{id}  (태그 단건 조회)
        → TagRepository.findById() + Service 조회 메서드 + Controller 엔드포인트
          + IllegalArgumentException (없는 경우 400)

이슈 3: GET /api/public/tag  (태그 목록 + 페이지네이션)
        → Repository.findAll(page, pageSize) + countAll() + Controller + meta 페이징 정보

이슈 4: PUT /api/tag/{id}  (태그 수정, JWT 인증 필요)
        → Service.updateTag() + @PlatformTransactional + Controller (@Auditing 활용)

이슈 5: DELETE /api/tag/{id}  (태그 삭제, JWT 인증 필요)
        → Service.deleteTag() + IllegalArgumentException(없음) + 204 응답
```

### 이슈 크기 기준

**완료 시간**: 이슈 하나를 반나절~하루 안에 완료할 수 있어야 한다.

**테스트 가능성 — FIRST 원칙**

| 원칙 | 기준 |
|------|------|
| Fast | 테스트가 수 초 안에 실행 |
| Isolated | 다른 이슈 없이 단독 실행 가능 |
| Repeatable | 환경과 무관하게 결과 동일 |
| Self-validating | 통과/실패가 자동 판단 |
| Timely | 구현 직전에 테스트를 먼저 작성할 수 있는 단위 |

**코드 변경 범위 — 보조 지표** (초과 시 재분해)

| 항목 | 기준 |
|------|------|
| 변경 파일 수 | 5개 이하 |
| 신규 클래스 수 (Service/Helper/DTO 합계) | 5개 이하 |
| Flyway 마이그레이션 파일 수 | 1개 이하 |
| AC 항목 수 | 5개 이하 |

### 자가 검증 (이슈 작성 후 반드시 확인)

- "이 이슈만 완료하면 Swagger UI 또는 curl로 호출 가능한 엔드포인트가 생기는가?" → **Yes**여야 진행
- "이 이슈의 테스트를 앞 이슈 없이 단독으로 작성할 수 있는가?" → **Yes**여야 진행
- "이 이슈에서 신규 생성하는 Helper가 기존 Helper로 해결 가능한가?" → **Yes**라면 기존 재사용으로 이슈 수정. **No**(기존으로 해결 불가)일 때만 신규 생성 허용. Helper에 Repository 주입이 포함되어 있다면 → 제거하고 Service로 이동.
- "이 이슈에서 Controller에 try-catch가 포함되어 있는가?" → **No**여야 진행. 예외는 Service에서 `IllegalArgumentException` / `IllegalStateException`으로 throw. Flyway 없이 직접 DDL을 실행하는 코드가 있는가 → **No**여야 진행.

### Acceptance Criteria 형식

각 이슈에 반드시 Given-When-Then 형식의 AC를 포함한다.

```markdown
## Acceptance Criteria
- [ ] Given [사전 조건], When [HTTP 요청 or Service 호출], Then [응답 상태코드 + 바디 or 반환값]
- [ ] Given [사전 조건], When [HTTP 요청 or Service 호출], Then [응답 상태코드 + 바디 or 반환값]
```

### 테스트 레이어 가이드

각 이슈의 AC는 아래 두 레이어 테스트로 커버한다.

| 레이어 | 어노테이션 | 테스트 대상 | Mock 대상 |
|--------|-----------|-----------|---------|
| Service 단위 테스트 | `@ExtendWith(MockitoExtension.class)` | 비즈니스 로직, 예외 | Repository (`Mockito.mock`) |
| Controller 슬라이스 테스트 | `@WebMvcTest` | HTTP 요청/응답, 상태코드 | Service (`@MockBean`) |
| (선택) 통합 테스트 | `@SpringBootTest` | 전체 흐름 | — (H2 또는 Testcontainers) |

**AC Given-When-Then 백엔드 해석:**
- Given: Mock Repository 반환값 설정 또는 @MockBean Service 동작 설정
- When: `service.method()` 호출 또는 `mockMvc.perform(post(...))`
- Then: 반환값/예외 타입 검증 또는 응답 상태코드 + JSON 필드 검증

### 의존성 순서

앞 이슈의 결과가 다음 이슈의 입력이 되도록 배치한다. 역방향 개발 금지.
Flyway 마이그레이션과 JOOQ 재생성이 필요한 이슈는 반드시 첫 번째에 배치한다.

### 네이밍 규칙

이슈 제목·AC·구현 코드 모두 `spec-fixed.md`의 용어 정의를 따른다.
동의어 사용 금지 — 용어가 바뀌어야 한다면 spec-fixed.md를 먼저 수정하고 코드를 바꾼다.

### [GATE] 최종 승인

```
[GATE] issues.md를 사용자에게 보여주고 긍정 응답을 받을 때까지 대기.
       확인 항목:
         - 수직 슬라이스 기준을 충족하는가 (각 이슈 완료 시 curl 가능한가)
         - AC가 Given-When-Then 형식으로 구체적으로 작성되었는가
         - 의존성 순서가 올바른가 (Flyway 필요 이슈가 첫 번째인가)
       긍정 응답 전까지 코드 작성을 시작하지 않는다.
```

### 산출물

- `{root}/{module-name}/src/main/java/{pkg-root}/{feature-path}/docs/issues.md`

### 핸드오프

issues.md 확정 후 이슈 단위로 TDD 사이클을 실행한다.

**이슈별 TDD 사이클:**

```
/test-scenarios-be {N}   → Java 시그니처 확정 + 테스트 시나리오 도출 [GATE × 2]
/tdd-red-be {N}          → 시나리오 → 실패하는 JUnit 테스트 작성
/tdd-green-be {N}        → 테스트 통과 최소 구현 (Repository → Service → Controller)
/ac-verifier-be {N}      → AC 충족 독립 검증 — 테스트 통과 ≠ AC 충족 [GATE]
/tdd-refactor-be {N}     → 구조 개선 (Helper 추출, 컨벤션 일관성) [GATE]
/security-review-be {N}  → 보안 취약점·패턴 위반·코드 품질 점검 [GATE]
/create-pr-be            → git commit 안내 + PR 제목·본문 생성
```

각 단계는 `feature-planner-be` 세션 컨텍스트(`feature-path`, `module-name`, `pkg-root`)를 자동 전달받는다.

**Orval 알림:**
API 명세(`prd.md`의 API 명세 섹션)가 변경된 경우,
프론트엔드에서 TypeScript 타입을 재생성해야 한다:
```bash
cd front/react-workspace && pnpm orval
```

---

## 승인 게이트 요약

| 지점 | 확인 내용 | 긍정 응답 예시 |
|------|----------|--------------|
| 단계 0 진입 | 브랜치 추론 + 모듈 감지 결과 확정 | yes / ok / 확인 / 좋아 또는 수정 요청 |
| 단계 0 — spec.md | 기존 spec 검토 또는 신규 생성 확인 | yes / ok / 확인 / 좋아 또는 수정 요청 |
| 단계 1 후 | spec-fixed.md — 용어·모호성 확정 | yes / ok / 확인 / 좋아 |
| 단계 2-2 후 | 아키텍처 3안 중 하나 선택 | "A안으로 진행" 등 |
| 단계 2-4 후 | Out of Scope — 범위 확정 | yes / ok / 확인 / 좋아 |
| 단계 3 후 | 이슈 목록 — 수직슬라이스·AC·의존성 확인 | yes / ok / 확인 / 좋아 |

GATE가 없으면 AI가 판단 없이 끝까지 달려버린다.
각 GATE에서 반드시 멈추고 사용자의 응답을 기다릴 것.
