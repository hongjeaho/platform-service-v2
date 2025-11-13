# Platform Service API 서비스 문서

## 📋 프로젝트 개요

**프로젝트명**: 토지보상 재결 관리 시스템
**프로젝트 유형**: 정부/행정 플랫폼
**프레임워크**: Spring Boot 3.4.2 + React 19
**아키텍처**: 멀티 모듈 Gradle 프로젝트
**작성일**: 2025-11-13

---

## 🔧 기술 스택

### Backend

| 기술            | 버전    | 용도                    |
| --------------- | ------- | ----------------------- |
| Spring Boot     | 3.4.2   | 백엔드 프레임워크       |
| Spring Security | -       | 보안 및 인증            |
| Spring Batch    | -       | 외부 API 연동 배치 작업 |
| Spring WebFlux  | -       | 비동기/리액티브 처리    |
| MySQL           | 8.0.31  | 데이터베이스            |
| JOOQ            | 3.19.18 | 타입 안전 SQL 쿼리      |
| Flyway          | -       | DB 마이그레이션         |
| Swagger/OpenAPI | 3.x     | API 문서화              |
| JWT             | -       | 토큰 기반 인증          |

### Frontend

| 기술        | 버전                    | 용도                              |
| ----------- | ----------------------- | --------------------------------- |
| React       | 19                      | UI 프레임워크                     |
| TypeScript  | -                       | 타입 안전 자바스크립트            |
| Vite        | 7.x                     | 빌드 도구                         |
| TailwindCSS | 4.x                     | 스타일링                          |
| React Query | (@tanstack/react-query) | 서버 상태 관리                    |
| Jotai       | -                       | 클라이언트 상태 관리              |
| Orval       | -                       | OpenAPI 기반 클라이언트 자동 생성 |

---

## 📁 프로젝트 구조

```
platform-service-master/
├── api/platform/              # REST API 모듈
│   └── src/main/java/com/platform/api/platform/
│       ├── account/          # 계정 관리
│       ├── admin/            # 관리자 기능
│       ├── authority/        # 권한/인증
│       ├── board/            # 게시판
│       ├── conclusion/       # 재결서 작성/검토
│       ├── deliberation/     # 심의 관리
│       ├── file/             # 파일 관리
│       ├── ltis/             # LTIS 연동
│       ├── notice/           # 고지 결과
│       ├── opinion/          # 의견서 양식
│       ├── receipt/          # 접수/사건 관리
│       ├── references/       # 참고자료
│       └── system/           # 시스템 관리
│
├── batch/platform/            # Spring Batch 작업
│   └── src/main/java/com/platform/batch/platform/
│       ├── ltis/             # LTIS API 연동
│       ├── kapa/             # KAPA API 연동
│       └── common/config/    # WebClient 설정
│
├── common/
│   ├── core/                 # 기본 클래스, Enum, DTO, utils
│   ├── jooq/                 # jooq 설정
│   └── web/                  # 웹 설정 (Security, Swagger, JWT)
│
├── datasource/platform/     # 데이터베이스 계층
│   ├── src/main/java/       # JOOQ 리포지토리
│   └── flyway/              # DB 마이그레이션 스크립트
│
├── front/platform/           # React 프론트엔드
│   ├── src/
│   │   ├── api/             # 자동 생성된 API 클라이언트
│   │   ├── model/           # 자동 생성된 타입 정의
│   │   └── ...
│   └── orval.config.ts      # API 클라이언트 생성 설정
│
└── docker/                   # Docker 설정
```

---

## 🌐 API 엔드포인트 목록

### 📊 통계

- **컨트롤러**: 38개
- **엔드포인트**: 86개 이상
- **서비스 클래스**: 38개
- **리포지토리**: 54개 이상

---

## 1️⃣ 인증/권한 관리

### 기본 정보

- **기본 경로**: `/api/authority`, `/api/account`
- **컨트롤러**: `AuthorityController`, `AccountProfileController`, `AccountSecurityController`
- **서비스**: `AuthorityService`

### 엔드포인트

#### 공개 API (인증 불필요)

| 메서드 | 경로                          | 설명          |
| ------ | ----------------------------- | ------------- |
| POST   | `/api/public/authority/login` | 사용자 로그인 |

#### 계정 관리 (인증 필요)

| 메서드 | 경로                    | 설명               |
| ------ | ----------------------- | ------------------ |
| GET    | `/api/account/profile`  | 사용자 프로필 조회 |
| PUT    | `/api/account/security` | 비밀번호 변경      |

#### 권한 확인

| 메서드 | 경로                                   | 설명                |
| ------ | -------------------------------------- | ------------------- |
| GET    | `/api/authority/implementer/{judgSeq}` | 사건 접근 권한 확인 |

---

## 2️⃣ 관리자 기능

### 기본 정보

- **기본 경로**: `/api/admin`
- **권한**: ADMIN 역할 필요

### 2.1 사용자 관리

#### 엔드포인트

| 메서드 | 경로                              | 설명                      | 파라미터          |
| ------ | --------------------------------- | ------------------------- | ----------------- |
| GET    | `/api/admin/userManagement`       | 사용자 목록 검색 (페이징) | SearchUserRequest |
| POST   | `/api/admin/userManagement`       | 신규 사용자 생성          | CreateUserRequest |
| PUT    | `/api/admin/userManagement/{seq}` | 사용자 정보 수정          | UpdateUserRequest |

#### 서비스

- `AdminUserManagementService`
- `AdminUserManagementReadService`

### 2.2 위원회 관리

#### 엔드포인트

| 메서드 | 경로                         | 설명                  |
| ------ | ---------------------------- | --------------------- |
| GET    | `/api/admin/committee`       | 위원회 위원 목록 검색 |
| POST   | `/api/admin/committee`       | 위원 등록             |
| PUT    | `/api/admin/committee/{seq}` | 위원 정보 수정        |
| DELETE | `/api/admin/committee/{seq}` | 위원 삭제             |

#### 서비스

- `AdminCommitteeService`
- `AdminCommitteeReadService`

### 2.3 지구담당 관리

#### 엔드포인트

| 메서드 | 경로                              | 설명               |
| ------ | --------------------------------- | ------------------ |
| GET    | `/api/admin/districtCharge`       | 지구담당 목록 검색 |
| POST   | `/api/admin/districtCharge`       | 지구담당 등록      |
| PUT    | `/api/admin/districtCharge/{seq}` | 지구담당 수정      |
| DELETE | `/api/admin/districtCharge/{seq}` | 지구담당 삭제      |

#### 서비스

- `AdminDistrictChargeService`
- `AdminDistrictChargeReadService`

---

## 3️⃣ 게시판 시스템

### 기본 정보

- **기본 경로**: `/api/board`
- **컨트롤러**: `BoardController`, `AnnouncementController`, `QuestionAnswerController`

### 3.1 일반 게시판

#### 엔드포인트

| 메서드 | 경로                                                | 설명                       | 비고                |
| ------ | --------------------------------------------------- | -------------------------- | ------------------- |
| GET    | `/api/board/application`                                   | 게시글 목록 검색           | 페이징 지원         |
| POST   | `/api/board/application/InsertOrUpdateBoardContent`        | 게시글 생성/수정           | -                   |
| POST   | `/api/board/application/InsertOrUpdateBoardContentAndFile` | 파일 포함 게시글 생성/수정 | multipart/form-data |
| POST   | `/api/board/application/{boardSeq}/updateBoardViewCount`   | 조회수 증가                | -                   |
| POST   | `/api/board/application/{boardSeq}/removeBoardContent`     | 게시글 삭제                | -                   |

#### 서비스

- `BoardService`
- `BoardReadService`

### 3.2 공지사항

#### 엔드포인트

| 메서드 | 경로                      | 설명               |
| ------ | ------------------------- | ------------------ |
| GET    | `/api/board/announcement` | 공지사항 목록 조회 |

#### 서비스

- `AnnouncementReadService`

### 3.3 Q&A 게시판

#### 엔드포인트

| 메서드 | 경로                              | 설명            |
| ------ | --------------------------------- | --------------- |
| GET    | `/api/board/questionAnswer`       | Q&A 게시글 검색 |
| POST   | `/api/board/questionAnswer`       | Q&A 게시글 작성 |
| PUT    | `/api/board/questionAnswer/{seq}` | Q&A 게시글 수정 |
| DELETE | `/api/board/questionAnswer/{seq}` | Q&A 게시글 삭제 |

#### 서비스

- `QuestionAnswerService`
- `QuestionAnswerReadService`

---

## 4️⃣ 접수/사건 관리

### 기본 정보

- **기본 경로**: `/api/receipt/application`
- **컨트롤러**: `ReceiptController`
- **주요 기능**: 토지보상 재결 사건 접수 및 관리

### 조회 API

| 메서드 | 경로                                            | 설명                | 반환 타입                 |
| ------ | ----------------------------------------------- | ------------------- | ------------------------- |
| GET    | `/api/receipt/application`                             | 접수 목록 검색      | Page<ReceiptListResponse> |
| GET    | `/api/receipt/application/{judgSeq}/currentStatusCode` | 현재 처리 상태 조회 | CurrentStatusCodeResponse |
| GET    | `/api/receipt/application/{judgSeq}/businessInfo`      | 사업 정보 조회      | BusinessInfoResponse      |
| GET    | `/api/receipt/application/{judgSeq}/quantityReport`    | 물건조서 조회       | QuantityReportResponse    |
| GET    | `/api/receipt/application/{judgSeq}/previousAppraisal` | 감정평가 정보 조회  | PreviousAppraisalResponse |
| GET    | `/api/receipt/application/{judgSeq}/attachment`        | 첨부파일 목록 조회  | List<AttachmentResponse>  |

### 등록/수정 API

| 메서드 | 경로                                              | 설명                     | 요청 타입                  |
| ------ | ------------------------------------------------- | ------------------------ | -------------------------- |
| POST   | `/api/receipt/application/{judgSeq}`                     | 사건 기본 정보 등록/수정 | ReceiptRequest             |
| POST   | `/api/receipt/application/{judgSeq}/totalQuantityReport` | 물건조서 전체 수정       | TotalQuantityReportRequest |
| POST   | `/api/receipt/application/{judgSeq}/previousAppraisal`   | 감정평가 정보 수정       | multipart/form-data        |
| POST   | `/api/receipt/application/{judgSeq}/receiptAttachment`   | 첨부파일 업로드          | multipart/form-data        |
| POST   | `/api/receipt/application/{judgSeq}/complete`            | 접수 완료 처리           | -                          |

### 서비스

- `ReceiptService` - 등록/수정 작업
- `ReceiptReadService` - 조회 작업

### 리포지토리

- `ReceiptRepository`
- `ReceiptReadRepository`

---

## 5️⃣ 재결서 작성/검토

### 기본 정보

- **기본 경로**: `/api/conclusion/application`
- **컨트롤러**: `ConclusionReviewController`
- **주요 기능**: 토지보상 재결서 작성 및 검토

### 엔드포인트

| 메서드 | 경로                                                  | 설명                  | 비고                |
| ------ | ----------------------------------------------------- | --------------------- | ------------------- |
| GET    | `/api/conclusion/application`                                | 재결서 목록 검색      | 페이징 지원         |
| POST   | `/api/conclusion/application/{judgSeq}/start`                | 재결서 검토 시작      | 상태 변경           |
| POST   | `/api/conclusion/application/{judgSeq}/{opinionTemplateSeq}` | 재결서 내용 생성/수정 | multipart/form-data |
| POST   | `/api/conclusion/application/{judgSeq}/complete`             | 재결서 완료 처리      | -                   |

### 서비스

- `ConclusionReviewService`
- `ConclusionReviewReadService`
- `AsyncConclusionHelper` - 비동기 처리

### 리포지토리

- `ConclusionRepository`
- `ConclusionReadRepository`

---

## 6️⃣ 심의 관리

### 기본 정보

- **기본 경로**: `/api/deliberation`

### 6.1 심의 일정 관리

#### 엔드포인트

| 메서드 | 경로                               | 설명                |
| ------ | ---------------------------------- | ------------------- |
| GET    | `/api/deliberation/schedule`       | 심의 일정 목록 조회 |
| POST   | `/api/deliberation/schedule`       | 심의 일정 등록      |
| PUT    | `/api/deliberation/schedule/{seq}` | 심의 일정 수정      |
| DELETE | `/api/deliberation/schedule/{seq}` | 심의 일정 삭제      |

#### 서비스

- `DeliberationScheduleService`
- `DeliberationScheduleReadService`

### 6.2 심의 안건 관리

#### 엔드포인트

| 메서드 | 경로                             | 설명                |
| ------ | -------------------------------- | ------------------- |
| GET    | `/api/deliberation/agenda`       | 심의 안건 목록 검색 |
| POST   | `/api/deliberation/agenda`       | 심의 안건 등록      |
| PUT    | `/api/deliberation/agenda/{seq}` | 심의 안건 수정      |

#### 서비스

- `DeliberationAgendaService`
- `DeliberationAgendaReadService`

---

## 7️⃣ 참고자료 관리

### 기본 정보

- **기본 경로**: `/api/references`

### 7.1 법령 관리

#### 엔드포인트

| 메서드 | 경로                           | 설명      |
| ------ | ------------------------------ | --------- |
| GET    | `/api/references/decree`       | 법령 검색 |
| POST   | `/api/references/decree`       | 법령 등록 |
| PUT    | `/api/references/decree/{seq}` | 법령 수정 |
| DELETE | `/api/references/decree/{seq}` | 법령 삭제 |

#### 서비스

- `DecreeService`
- `DecreeReadService`

### 7.2 판례 관리

#### 엔드포인트

| 메서드 | 경로                              | 설명      |
| ------ | --------------------------------- | --------- |
| GET    | `/api/references/precedent`       | 판례 검색 |
| POST   | `/api/references/precedent`       | 판례 등록 |
| PUT    | `/api/references/precedent/{seq}` | 판례 수정 |
| DELETE | `/api/references/precedent/{seq}` | 판례 삭제 |

#### 서비스

- `PrecedentService`
- `PrecedentReadService`

### 7.3 재결의견 관리

#### 엔드포인트

| 메서드 | 경로                                      | 설명          |
| ------ | ----------------------------------------- | ------------- |
| GET    | `/api/references/conclusionOpinion`       | 재결의견 검색 |
| POST   | `/api/references/conclusionOpinion`       | 재결의견 등록 |
| PUT    | `/api/references/conclusionOpinion/{seq}` | 재결의견 수정 |
| DELETE | `/api/references/conclusionOpinion/{seq}` | 재결의견 삭제 |

#### 서비스

- `ConclusionOpinionService`
- `ConclusionOpinionReadService`

### 7.4 지도 참고자료

#### 엔드포인트

| 메서드 | 경로                  | 설명               |
| ------ | --------------------- | ------------------ |
| GET    | `/api/references/map` | 지도 참고자료 조회 |

#### 서비스

- `MapReadService`

---

## 8️⃣ LTIS 연동 (외부 시스템)

### 기본 정보

- **기본 경로**: `/api/ltis`
- **설명**: 국토교통부 토지보상정보시스템(LTIS) 연동
- **컨트롤러**: `LTISInfoController`, `LTISReptController`

### 8.1 LTIS 정보 조회

#### 엔드포인트

| 메서드 | 경로                                  | 설명                |
| ------ | ------------------------------------- | ------------------- |
| GET    | `/api/ltis/businessSummary/{judgSeq}` | LTIS 사업 개요 정보 |
| GET    | `/api/ltis/appraisalInfo/{judgSeq}`   | LTIS 감정평가 정보  |
| GET    | `/api/ltis/implementerInfo/{judgSeq}` | LTIS 시행자 정보    |

#### 서비스

- `LTISInfoReadService`

### 8.2 LTIS 보고서

#### 엔드포인트

| 메서드 | 경로               | 설명                 |
| ------ | ------------------ | -------------------- |
| GET    | `/api/ltis/rept/*` | LTIS 보고서 관련 API |

#### 서비스

- `LTISReptReadService`

### 배치 연동

- **위치**: `batch/platform/src/main/java/com/platform/batch/platform/ltis/`
- **기능**: LTIS 데이터 동기화 배치 작업

---

## 9️⃣ 파일 관리

### 기본 정보

- **기본 경로**: `/api/file/application`
- **컨트롤러**: `FileController`
- **업로드 경로**: `C:\filedownload/` (설정 가능)

### 엔드포인트

| 메서드 | 경로                                | 설명          | 비고                |
| ------ | ----------------------------------- | ------------- | ------------------- |
| GET    | `/api/file/application/download/{fileSeq}` | 파일 다운로드 | UTF-8 파일명 인코딩 |

### 서비스

- `FileService`
- `FileReadService`

### 리포지토리

- `FileRepository`

### 특징

- UTF-8 파일명 인코딩 지원
- Multipart/form-data 업로드
- 다중 파일 업로드 지원

---

## 🔟 의견서 양식 관리

### 기본 정보

- **기본 경로**: `/api/opinion/case`
- **컨트롤러**: `OpinionCaseController`

### 엔드포인트

| 메서드 | 경로                      | 설명             |
| ------ | ------------------------- | ---------------- |
| GET    | `/api/opinion/case`       | 의견서 양식 검색 |
| POST   | `/api/opinion/case`       | 의견서 양식 등록 |
| PUT    | `/api/opinion/case/{seq}` | 의견서 양식 수정 |
| DELETE | `/api/opinion/case/{seq}` | 의견서 양식 삭제 |

### 서비스

- `OpinionCaseService`
- `OpinionCaseReadService`

---

## 1️⃣1️⃣ 고지 결과 관리

### 기본 정보

- **기본 경로**: `/api/notice/result`
- **컨트롤러**: `NoticeResultController`

### 엔드포인트

| 메서드 | 경로                       | 설명           |
| ------ | -------------------------- | -------------- |
| GET    | `/api/notice/result`       | 고지 결과 검색 |
| POST   | `/api/notice/result`       | 고지 결과 등록 |
| PUT    | `/api/notice/result/{seq}` | 고지 결과 수정 |
| DELETE | `/api/notice/result/{seq}` | 고지 결과 삭제 |

### 서비스

- `NoticeResultService`
- `NoticeResultReadService`

---

## 1️⃣2️⃣ 공통 서비스

### 기본 정보

- **기본 경로**: `/api/common`
- **컨트롤러**: `CommonController`

### 엔드포인트

| 메서드 | 경로            | 설명                        |
| ------ | --------------- | --------------------------- |
| GET    | `/api/common/*` | 공통 코드 및 기준 정보 조회 |

### 서비스

- `CommonReadService`

---

## 🏗️ 서비스 계층 아키텍처

### Read/Write 분리 패턴

프로젝트는 **CQRS(Command Query Responsibility Segregation)** 패턴을 부분적으로 적용하여 읽기와 쓰기 작업을 분리합니다.

#### 구조

```
domain/
  ├── controller/
  │   └── DomainController.java
  ├── service/
  │   ├── DomainService.java           # 쓰기 작업 (POST, PUT, DELETE)
  │   └── DomainReadService.java       # 읽기 작업 (GET)
  └── repository/
      ├── DomainRepository.java
      └── DomainReadRepository.java
```

#### 장점

1. **명확한 책임 분리**: 읽기와 쓰기 로직 분리
2. **성능 최적화**: 읽기 전용 쿼리 최적화 가능
3. **유지보수성**: 각 서비스의 역할이 명확
4. **테스트 용이성**: 단위 테스트 작성 용이

### 주요 서비스 클래스 (38개)

| 도메인       | 서비스 클래스                                                   | 주요 기능         |
| ------------ | --------------------------------------------------------------- | ----------------- |
| Authority    | `AuthorityService`                                              | 권한 확인 및 인증 |
| Receipt      | `ReceiptService`, `ReceiptReadService`                          | 접수/사건 관리    |
| Conclusion   | `ConclusionReviewService`, `ConclusionReviewReadService`        | 재결서 관리       |
| Board        | `BoardService`, `BoardReadService`                              | 게시판 관리       |
| Admin        | `AdminUserManagementService`, `AdminCommitteeService`           | 관리자 기능       |
| LTIS         | `LTISInfoReadService`, `LTISReptReadService`                    | LTIS 연동         |
| Deliberation | `DeliberationScheduleService`, `DeliberationAgendaService`      | 심의 관리         |
| References   | `DecreeService`, `PrecedentService`, `ConclusionOpinionService` | 참고자료 관리     |
| File         | `FileService`, `FileReadService`                                | 파일 관리         |

**서비스 위치**: `api/platform/src/main/java/com/platform/api/platform/*/service/`

---

## 🔗 외부 API 연동

### Batch 모듈을 통한 외부 시스템 연동

프로젝트는 **Spring Batch**를 사용하여 외부 API와 연동합니다.

### 연동 시스템

#### 1. LTIS API (토지보상정보시스템)

**위치**: `batch/platform/src/main/java/com/platform/batch/platform/ltis/`

**기능**:

- LTIS 데이터 동기화
- 사업 정보, 감정평가 정보, 시행자 정보 수집
- 배치 작업을 통한 정기적인 데이터 업데이트

**배치 작업**:

- LTIS 데이터 동기화 Job
- 스케줄링 기반 자동 실행

#### 2. KAPA API (토지가격정보시스템)

**위치**: `batch/platform/src/main/java/com/platform/batch/platform/kapa/`

**기능**:

- 표준지 공시지가 데이터 수집
- 개별공시지가 데이터 수집
- 토지가격 정보 동기화

**데이터**:

- 표준지 가격 정보
- 개별 토지 가격 정보
- 가격 변동 이력

#### 3. Kakao API (카카오맵)

**위치**: `batch/platform/src/main/java/com/platform/batch/platform/common/config/WebClientConfig.java`

**기능**:

- 지오코딩 (주소 → 좌표)
- 역 지오코딩 (좌표 → 주소)
- 주소 검색

### WebClient 설정

**파일**: `batch/platform/src/main/java/com/platform/batch/platform/common/config/WebClientConfig.java`

```java
@Configuration
public class WebClientConfig {

    @Bean
    public WebClient ltisWebClient() {
        // LTIS API용 WebClient
        ConnectionProvider provider = ConnectionProvider.builder("ltis-pool")
            .maxConnections(30)
            .pendingAcquireTimeout(Duration.ofMinutes(30))
            .build();

        return WebClient.builder()
            .clientConnector(new ReactorClientHttpConnector(
                HttpClient.create(provider)
                    .responseTimeout(Duration.ofMinutes(30))
            ))
            .codecs(configurer -> configurer
                .defaultCodecs()
                .maxInMemorySize(100 * 1024 * 1024) // 100MB
            )
            .build();
    }
}
```

**설정 값**:

- **최대 연결 수**: 30
- **타임아웃**: 30분
- **메모리 제한**: 100MB
- **연결 풀**: 커넥션 풀 사용

---

## ⚙️ API 설정 파일

### Application 설정

#### 파일: `api/platform/src/main/resources/application.yml`

```yaml
server:
  port: 8080
  servlet:
    encoding:
      charset: UTF-8
      enabled: true
      force: true

spring:
  profiles:
    active: local

  datasource:
    url: jdbc:mysql://localhost:3306/platform?useUnicode=true&characterEncoding=utf8
    username: root
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: none
    show-sql: false

  servlet:
    multipart:
      max-file-size: 100MB
      max-request-size: 100MB

jwt:
  secret: ${JWT_SECRET:your-secret-key}
  expiration:
    period: 86400000 # 24시간 (밀리초)
    renew-before: 3600000 # 1시간 전 갱신 (밀리초)

file:
  upload-path: C:\filedownload/

logging:
  level:
    com.platform: DEBUG
    org.springframework.web: DEBUG
```

#### 주요 설정

| 항목                          | 값               | 설명                        |
| ----------------------------- | ---------------- | --------------------------- |
| `server.port`                 | 8080             | API 서버 포트               |
| `jwt.expiration.period`       | 86400000         | JWT 토큰 만료 시간 (24시간) |
| `jwt.expiration.renew-before` | 3600000          | 토큰 갱신 시점 (1시간 전)   |
| `file.upload-path`            | C:\filedownload/ | 파일 업로드 경로            |
| `multipart.max-file-size`     | 100MB            | 최대 파일 크기              |

---

### Security 설정

#### 파일: `api/platform/src/main/java/com/platform/api/platform/config/SecurityConfig.java`

#### 주요 기능

##### 1. JWT 인증

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
        .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    return http.build();
}
```

##### 2. CORS 설정

**허용 도메인**:

- `http://localhost:3000` (로컬 개발)
- `https://dev.platform.go.kr` (개발 환경)

##### 3. 공개 엔드포인트

```java
.authorizeHttpRequests(authorize -> authorize
    .requestMatchers("/api/public/**").permitAll()
    .requestMatchers("/public/swagger-ui/**").permitAll()
    .requestMatchers("/v3/api-docs/**").permitAll()
    .anyRequest().authenticated()
)
```

##### 4. 역할 기반 접근 제어 (RBAC)

| 역할        | 권한     | 설명                     |
| ----------- | -------- | ------------------------ |
| ADMIN       | 관리자   | 시스템 관리, 사용자 관리 |
| DECISION    | 재결위원 | 심의/재결 권한           |
| IMPLEMENTER | 시행자   | 사건 접수 및 처리        |

---

### Swagger/OpenAPI 설정

#### 파일: `common/web/src/main/java/com/platform/common/web/config/SwaggerConfig.java`

#### 주요 설정

```java
@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Platform Service API",
        version = "1.0",
        description = "토지보상 재결 관리 시스템 API"
    ),
    security = @SecurityRequirement(name = "Bearer Authentication")
)
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .components(new Components()
                .addSecuritySchemes("Bearer Authentication",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                )
            );
    }
}
```

#### 접근 방법

**로컬 환경**:

- URL: `http://localhost:8080/swagger-ui/index.html`
- 프로필: `local`만 활성화

**특징**:

- JWT 토큰 인증 지원
- 모든 엔드포인트 자동 문서화
- Try it out 기능 제공
- OpenAPI 3.0 스펙 기반

#### 프론트엔드 연동

Swagger에서 생성된 OpenAPI 스펙을 사용하여 **Orval**로 TypeScript 클라이언트 자동 생성:

```bash
cd front/platform
yarn orval-fix  # 백엔드 서버가 8080 포트에서 실행 중이어야 함
```

**생성되는 파일**:

- `front/platform/src/api/` - API 호출 함수
- `front/platform/src/model/` - TypeScript 타입 정의

---

## 💾 데이터베이스 계층

### 데이터 액세스 기술

#### 1. JOOQ (타입 안전 SQL)

**특징**:

- 컴파일 타임 타입 체크
- IDE 자동완성 지원
- SQL 인젝션 방지
- 복잡한 쿼리 작성 용이

**코드 생성**:

```bash
./gradlew generateJooq
```

**위치**: `datasource/platform/src/generated`

#### 2. Flyway (DB 마이그레이션)

**마이그레이션 파일 위치**: `datasource/platform/flyway/`

**마이그레이션 파일 수**: 31개

**명명 규칙**:

```
V{버전}__{설명}.sql
예: V1__create_users_table.sql
```

**주요 마이그레이션**:

1. `V1__create_base_tables.sql` - 기본 테이블 생성
2. `V2__create_code_tables.sql` - 코드 테이블 생성
3. `V3__insert_initial_data.sql` - 초기 데이터 입력
4. ...
5. `V31__add_index.sql` - 인덱스 추가

**Flyway 명령**:

```bash
# 마이그레이션 실행
./gradlew flywayMigrate

# 마이그레이션 정보 확인
./gradlew flywayInfo

# 데이터베이스 초기화 (주의!)
./gradlew flywayClean
```

### Repository 패턴

#### Repository 구조 (54개 이상)

```
datasource/platform/src/main/java/com/platform/datasource/platform/repository/
├── authority/
│   └── AuthorityRepository.java
├── receipt/
│   ├── ReceiptRepository.java
│   └── ReceiptReadRepository.java
├── board/
│   ├── BoardRepository.java
│   └── BoardSearchRepository.java
├── conclusion/
│   ├── ConclusionRepository.java
│   └── ConclusionReadRepository.java
└── ...
```

#### 주요 Repository

| Repository              | 기능                      | 사용 기술 |
| ----------------------- | ------------------------- | --------- |
| `AuthorityRepository`   | 사용자 인증               | JOOQ      |
| `ReceiptRepository`     | 접수 데이터 쓰기          | JOOQ      |
| `ReceiptReadRepository` | 접수 데이터 읽기          | JOOQ      |
| `BoardRepository`       | 게시판 데이터 쓰기        | JOOQ      |
| `BoardSearchRepository` | 게시판 검색 (복잡한 쿼리) | JOOQ DSL  |
| `LTISReadRepository`    | LTIS 데이터 읽기          | JOOQ      |
| `FileRepository`        | 파일 메타데이터           | JOOQ      |

---

## 🎯 주요 기능

### 1. 다중 파일 업로드

**지원 엔드포인트**:

- 재결서 작성: `POST /api/conclusion/application/{judgSeq}/{opinionTemplateSeq}`
- 접수 첨부: `POST /api/receipt/application/{judgSeq}/receiptAttachment`
- 게시판: `POST /api/board/application/InsertOrUpdateBoardContentAndFile`

**요청 타입**: `multipart/form-data`

**예시**:

```http
POST /api/receipt/application/123/receiptAttachment
Content-Type: multipart/form-data

------WebKitFormBoundary
Content-Disposition: form-data; name="files"; filename="document1.pdf"
Content-Type: application/pdf

[파일 데이터]
------WebKitFormBoundary
Content-Disposition: form-data; name="files"; filename="document2.pdf"
Content-Type: application/pdf

[파일 데이터]
------WebKitFormBoundary--
```

### 2. JWT 인증

**토큰 구조**:

```
Header.Payload.Signature
```

**Payload 내용**:

```json
{
  "sub": "user@example.com",
  "userSeq": 123,
  "role": "ADMIN",
  "iat": 1699999999,
  "exp": 1700086399
}
```

**토큰 갱신**:

- 만료 1시간 전부터 갱신 가능
- 갱신 시 새로운 토큰 발급

**인증 헤더**:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. 캐싱

**사용 기술**: Caffeine Cache

**캐시 대상**:

- 공통 코드
- 참고자료 (법령, 판례)
- 사용자 권한 정보

**설정**:

```java
@Cacheable(value = "commonCode", key = "#codeType")
public List<CodeResponse> getCommonCode(String codeType) {
    // ...
}
```

### 4. 비동기 작업

**사용 클래스**: `AsyncConclusionHelper`

**비동기 작업 예시**:

- 재결서 PDF 생성
- 대용량 데이터 처리
- 외부 API 호출

**설정**:

```java
@Async
public CompletableFuture<String> generatePdf(Long judgSeq) {
    // PDF 생성 로직
    return CompletableFuture.completedFuture(pdfPath);
}
```

### 5. 파일 관리

**특징**:

- UTF-8 파일명 인코딩
- 파일 타입 검증
- 바이러스 스캔 (옵션)
- 저장 경로 보안

**다운로드 헤더**:

```http
Content-Type: application/octet-stream
Content-Disposition: attachment; filename*=UTF-8''%ED%8C%8C%EC%9D%BC%EB%AA%85.pdf
```

### 6. 페이지네이션

**모든 검색 엔드포인트 지원**

**요청 파라미터**:

```java
public class PageRequest {
    private int page = 0;       // 페이지 번호 (0부터 시작)
    private int size = 20;      // 페이지 크기
    private String sort;        // 정렬 기준 (예: "createdAt,desc")
}
```

**응답 구조**:

```json
{
  "content": [...],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalElements": 100,
  "totalPages": 5,
  "last": false,
  "first": true
}
```

### 7. 감사 로깅

**기록 항목**:

- 요청 URL
- 요청 메서드
- 요청 파라미터
- 사용자 정보
- 요청/응답 시간
- 처리 결과

**로그 위치**: `logs/audit.log`

### 8. 에러 핸들링

**Global Exception Handler**:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse(e.getErrorCode(), e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse("INTERNAL_ERROR", "서버 오류가 발생했습니다."));
    }
}
```

**에러 응답 구조**:

```json
{
  "errorCode": "INVALID_INPUT",
  "message": "입력 값이 올바르지 않습니다.",
  "timestamp": "2025-11-13T10:30:00",
  "path": "/api/receipt/application"
}
```

### 9. 데이터 마스킹

**마스킹 대상**:

- 주민등록번호
- 전화번호
- 이메일
- 계좌번호

**마스킹 예시**:

- 주민등록번호: `123456-*******`
- 전화번호: `010-****-5678`
- 이메일: `user***@example.com`

### 10. 배치 처리

**Spring Batch 작업**:

| 작업명      | 실행 주기         | 설명                 |
| ----------- | ----------------- | -------------------- |
| LTIS 동기화 | 매일 02:00        | LTIS 데이터 동기화   |
| KAPA 동기화 | 매주 월요일 03:00 | 토지가격 정보 동기화 |
| 통계 생성   | 매일 04:00        | 일일 통계 생성       |

**실행 방법**:

```bash
# 배치 애플리케이션 실행
./gradlew :batch-platform:bootRun

# 특정 Job 실행
./gradlew :batch-platform:bootRun --args='--spring.batch.job.names=ltisJob'
```

---

## 🚀 프로젝트 실행 방법

### 사전 요구사항

- **Java**: 17 이상
- **Node.js**: 18 이상
- **MySQL**: 8.0.31
- **Docker** (선택사항)

### 1. 데이터베이스 설정

#### Docker 사용

```bash
# MySQL 컨테이너 시작
docker-compose up -d
```

#### 수동 설정

```sql
CREATE DATABASE platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'platform'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON platform.* TO 'platform'@'%';
FLUSH PRIVILEGES;
```

### 2. 데이터베이스 마이그레이션

```bash
# Flyway 마이그레이션 실행
./gradlew flywayMigrate

# JOOQ 코드 생성
./gradlew generateJooq
```

### 3. 백엔드 실행

```bash
# API 서버 실행
./gradlew :api-platform:bootRun

# 접속: http://localhost:8080
# Swagger: http://localhost:8080/swagger-ui/index.html
```

### 4. 프론트엔드 실행

```bash
# 프론트엔드 디렉토리로 이동
cd front/platform

# 의존성 설치
yarn install

# API 클라이언트 생성 (백엔드가 실행 중이어야 함)
yarn orval-fix

# 개발 서버 시작
yarn start

# 접속: http://localhost:3000
```

### 5. 배치 실행 (선택사항)

```bash
# 배치 애플리케이션 실행
./gradlew :batch-platform:bootRun
```

---

## 📝 개발 가이드

### API 개발 절차

1. **DTO 정의** (`api/platform//application`)

   ```java
   public record CreateReceiptRequest(
       String title,
       String businessType,
       LocalDate receiptDate
   ) {}
   ```

2. **Repository 작성** (`datasource/platform`)

   ```java
   @Repository
   public class ReceiptRepository {
       public void insert(Receipt receipt) {
           // JOOQ 사용
       }
   }
   ```

3. **Service 작성** (`api/platform`)

   ```java
   @Service
   public class ReceiptService {
       public void createReceipt(CreateReceiptRequest request) {
           // 비즈니스 로직
       }
   }
   ```

4. **Controller 작성** (`api/platform`)

   ```java
   @RestController
   @RequestMapping("/api/receipt/application")
   public class ReceiptController {

       @PostMapping
       @Operation(summary = "접수 등록")
       public ResponseEntity<Void> createReceipt(@RequestBody CreateReceiptRequest request) {
           receiptService.createReceipt(request);
           return ResponseEntity.ok().build();
       }
   }
   ```

5. **Swagger 문서화**

   ```java
   @Operation(
       summary = "접수 등록",
       description = "새로운 토지보상 재결 사건을 접수합니다."
   )
   @ApiResponses({
       @ApiResponse(responseCode = "200", description = "성공"),
       @ApiResponse(responseCode = "400", description = "잘못된 요청"),
       @ApiResponse(responseCode = "401", description = "인증 실패")
   })
   ```

6. **프론트엔드 클라이언트 생성**
   ```bash
   cd front/platform
   yarn orval-fix
   ```

### 코드 컨벤션

#### Java

- **패키지명**: 소문자, 단어 구분
- **클래스명**: PascalCase
- **메서드명**: camelCase
- **상수**: UPPER_SNAKE_CASE

#### TypeScript

- **파일명**: kebab-case
- **컴포넌트명**: PascalCase
- **변수/함수명**: camelCase
- **타입명**: PascalCase

### Git 브랜치 전략

- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치
- `bugfix/*`: 버그 수정 브랜치
- `hotfix/*`: 긴급 수정 브랜치

---

## 🔒 보안 고려사항

### 1. 인증/인가

- JWT 토큰 기반 인증
- 역할 기반 접근 제어 (RBAC)
- 토큰 만료 및 갱신 메커니즘

### 2. 데이터 보안

- 민감 정보 마스킹
- SQL 인젝션 방지 (JOOQ 사용)
- XSS 방지 (입력 값 검증)

### 3. 파일 보안

- 파일 타입 검증
- 파일 크기 제한
- 안전한 파일명 처리

### 4. 통신 보안

- HTTPS 사용 (프로덕션)
- CORS 설정
- CSRF 방지

---

## 📊 성능 최적화

### 1. 데이터베이스

- 인덱스 최적화
- 쿼리 최적화 (JOOQ)
- 커넥션 풀 설정

### 2. 캐싱

- Caffeine 캐시 사용
- 공통 코드 캐싱
- 정적 리소스 캐싱

### 3. 비동기 처리

- 비동기 작업 분리
- 배치 처리 활용

### 4. 프론트엔드

- Code Splitting
- Lazy Loading
- React Query 캐싱

---

## 🧪 테스트

### 단위 테스트

```bash
# 백엔드 테스트
./gradlew test

# 프론트엔드 테스트
cd front/platform
yarn test
```

### 통합 테스트

```bash
./gradlew integrationTest
```

### API 테스트

- Swagger UI를 통한 수동 테스트

---

## 📚 참고 자료

### 공식 문서

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [JOOQ Documentation](https://www.jooq.org/doc/latest/manual/)
- [React Documentation](https://react.dev/)
- [React Query Documentation](https://tanstack.com/query/latest)

### 프로젝트 문서

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI Spec: `http://localhost:8080/v3/api-docs`

---

## 🔄 업데이트 이력

| 버전 | 날짜       | 내용           |
| ---- | ---------- | -------------- |
| 1.0  | 2025-11-13 | 초기 문서 작성 |
