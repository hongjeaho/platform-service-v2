# Spring Platform V2

Spring Boot + React 기반의 멀티모듈 플랫폼 프로젝트입니다.

## 목차

1. [프로젝트 소개](#1-프로젝트-소개)
2. [프로젝트 초기 설정](#2-프로젝트-초기-설정)
3. [개발 서버 실행](#3-개발-서버-실행)
4. [운영(개발) 서버 배포](#4-운영개발-서버-배포)
5. [모니터링](#5-모니터링)

---

## 1. 프로젝트 소개

### 기술 스택

| 영역 | 기술 |
|---|---|
| 백엔드 | Spring Boot 3.4.2, WebFlux, Spring Security |
| ORM / DB | JOOQ 3.19.18, MyBatis, Flyway, MySQL 8.0.45 |
| 인증 | JWT |
| 프론트엔드 | React 19, TypeScript 5.9, Vite 7.2 |
| 스타일링 | Tailwind CSS 4.1 |
| 상태 관리 | TanStack Query, Jotai |
| API 클라이언트 | Orval (OpenAPI 기반 자동 생성) |
| 인프라 | Docker Compose (MySQL), HikariCP, Prometheus/Micrometer |

### 멀티모듈 구조

```
spring-platform-v2/
├── api/
│   └── platform/          # Spring Boot REST API 서버 (포트 8080)
├── batch/
│   └── platform/          # 배치 처리
├── common/
│   ├── core/              # 핵심 공통 라이브러리 (JWT, PDF, OpenAPI)
│   ├── web/               # 웹 공통 (AOP, 캐싱, 모니터링)
│   └── jooq/              # JOOQ 코드 생성 전략
├── datasource/
│   └── platform/          # DB 접근 계층 (JOOQ, MyBatis, Flyway)
└── front/
    └── platform/          # React 웹 UI (포트 3000)
```

---

## 2. 프로젝트 초기 설정

### 사전 요구 사항

- Java 21+
- Gradle 8+
- Node.js 20+ / Yarn
- Docker & Docker Compose

### 저장소 클론

```bash
git clone <repository-url>
cd spring-platform-v2
```

### 데이터베이스 설정 (Docker)

로컬 개발 환경에서는 Docker Compose로 MySQL을 실행합니다.

```bash
docker-compose up -d
```

MySQL 접속 정보 (로컬):
- Host: `localhost:3306`
- Database: `store`
- Username: `root`
- Password: `root`

### 백엔드 초기 설정

Spring Boot는 `.env` 파일을 자동으로 읽지 않습니다. `.env` 파일은 참고용 템플릿이며, 실제 환경변수는 아래 방법 중 하나로 적용합니다.

**방법 1 - shell export (Gradle 태스크 및 bootRun 실행 시):**

```bash
export $(grep -v '^#' .env | xargs)
```

**방법 2 - IntelliJ Run Configuration (bootRun 시):**

`Run/Debug Configurations` → `Modify options` → `Environment variables`에 직접 입력합니다.

**로컬 개발 핵심 환경변수:**

| 환경변수 | 용도 | 기본값 |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | Spring 프로파일 활성화 | `local` |
| `JWT_SECRET` | JWT 서명 키 | `local-dev-secret-change-in-production` |
| `FILE_UPLOAD_PATH` | 파일 업로드 경로 | `./uploads` |
| `DB_JDBC_URL` | JOOQ/Flyway Gradle 태스크용 DB URL | — |
| `DB_USERNAME` | JOOQ/Flyway Gradle 태스크용 DB 유저 | — |
| `DB_PASSWORD` | JOOQ/Flyway Gradle 태스크용 DB 패스워드 | — |

> `DB_JDBC_URL`, `DB_USERNAME`, `DB_PASSWORD`는 `./gradlew :datasource:platform:generateJooq` 실행 시 필요합니다. 설정하지 않으면 `gradle.properties`의 로컬 기본값을 사용합니다.
> `JWT_SECRET`은 로컬 개발 시 기본값이 적용되므로 별도 설정이 없어도 무방합니다.

### 프론트엔드 초기 설정

```bash
cd front/platform
yarn install
```

프론트엔드 환경변수 파일을 생성합니다.

```bash
# front/platform/.env
VITE_API_BASE_URL=http://localhost:8080
```

Vite는 `/api` 경로를 `http://localhost:8080`으로 프록시합니다. (`vite.config.ts` 참고)

### JOOQ 코드 생성

백엔드 실행 전, DB 스키마를 기반으로 JOOQ 코드를 생성합니다.
Docker MySQL이 실행 중인 상태에서 아래 명령어를 실행합니다.

```bash
./gradlew :datasource:platform:generateJooq
```

---

## 3. 개발 서버 실행

### 백엔드 로컬 실행

```bash
./gradlew :api:platform:bootRun --args='--spring.profiles.active=local'
```

또는 환경변수 `SPRING_PROFILES_ACTIVE=local`이 shell에 export된 경우:

```bash
./gradlew :api:platform:bootRun
```

백엔드 서버가 `http://localhost:8080`에서 실행됩니다.

**Spring 프로파일 구성:**

| 프로파일 | 활성화 설정 파일 |
|---|---|
| `local` | `application.yml`, `application-datasource-platform.yml` |
| `dev` | `application.yml`, `application-dev.yml`, `application-datasource-platform.yml`, `application-datasource-platform-dev.yml` |

### 프론트엔드 로컬 실행

```bash
cd front/platform
yarn dev
```

프론트엔드 서버가 `http://localhost:3000`에서 실행됩니다.

### API 클라이언트 자동 생성 (Orval)

백엔드 서버가 실행 중인 상태에서 OpenAPI 스펙을 기반으로 TypeScript API 클라이언트를 생성합니다.

```bash
cd front/platform
yarn orval
```

- 입력: `http://localhost:8080/api/public/api-docs/json`
- 설정 파일: `front/platform/config/orval.config.ts`

---

## 4. 운영(개발) 서버 배포

### 환경설정 파일 세팅 (dev 프로파일)

운영/개발 서버에서는 `dev` 프로파일을 사용합니다.

**관련 설정 파일:**

| 파일 | 설명 |
|---|---|
| `api/platform/src/main/resources/application.yml` | 공통 애플리케이션 설정 |
| `api/platform/src/main/resources/application-dev.yml` | dev 환경 설정 |
| `datasource/platform/src/main/resources/application-datasource-platform.yml` | DB 공통 설정 |
| `datasource/platform/src/main/resources/application-datasource-platform-dev.yml` | dev DB 설정 |
| `api/platform/src/main/resources/logback-spring.xml` | 로그 설정 |

### 환경변수 설정

Spring Boot는 `.env` 파일을 자동으로 읽지 않습니다. 서버에서는 **systemd**를 통해 환경변수를 OS 수준으로 주입하는 방식을 권장합니다.

**dev 환경 핵심 환경변수:**

| 환경변수 | 필수 여부 | 설명 |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | 필수 | `dev` 로 설정 |
| `JWT_SECRET` | 필수 | 강력한 랜덤 문자열 |
| `PLATFORM_DB_PASSWORD` | 필수 | dev DB 패스워드 |
| `FILE_UPLOAD_PATH` | 선택 | 기본값 `./uploads` |

**dev 환경 DB 접속 정보:**
- Host: `localhost:3306`
- Database: `store`
- Username: `store`
- Password: `${PLATFORM_DB_PASSWORD}` (환경변수)

**1단계 - 서버에 환경변수 파일 생성:**

```bash
sudo mkdir -p /etc/platform
sudo vi /etc/platform/env
```

```
SPRING_PROFILES_ACTIVE=dev
JWT_SECRET=your_production_jwt_secret
PLATFORM_DB_PASSWORD=your_db_password
FILE_UPLOAD_PATH=/home/staff/platform/uploads
```

```bash
sudo chmod 600 /etc/platform/env
```

**2단계 - systemd unit 파일 작성 (`/etc/systemd/system/platform-api.service`):**

```ini
[Unit]
Description=Platform API Service
After=network.target

[Service]
User=staff
WorkingDirectory=/home/staff/platform
EnvironmentFile=/etc/platform/env
ExecStart=java -jar /home/staff/platform/platform.jar
SuccessExitStatus=143
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

> `EnvironmentFile=` 지시어로 환경변수 파일을 systemd가 로드하면, Spring Boot가 OS 환경변수로 읽습니다.

**3단계 - 서비스 등록 및 실행:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable platform-api
sudo systemctl start platform-api
sudo systemctl status platform-api
```

### 백엔드 빌드 및 배포

```bash
# JAR 파일 빌드
./gradlew :api:platform:build -x test

# 빌드 결과물 위치
# api/platform/build/libs/platform-*.jar

# JAR을 서버로 복사 후 서비스 재시작
sudo systemctl restart platform-api
```

### 프론트엔드 빌드 및 배포

```bash
cd front/platform

# 의존성 설치
yarn install --frozen-lockfile

# 프로덕션 빌드
yarn build

# 빌드 결과물 위치: front/platform/dist/
```

`dist/` 디렉토리를 Nginx 등의 웹 서버로 서빙합니다.

**Nginx 설정 예시:**

```nginx
server {
    listen 80;
    root /path/to/front/platform/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 로그 파일 위치 (dev/prod)

| 항목 | 경로 |
|---|---|
| 애플리케이션 로그 | `/home/staff/platform/logs/app.log` |
| 로그 형식 | JSON (구조화 로그) |
| 롤링 정책 | 일별 롤링, 30일 보관 |

로컬(`local` 프로파일)에서는 콘솔 출력만 사용합니다.

---

## 5. 모니터링

Prometheus/Micrometer 기반 메트릭이 제공됩니다.

| 엔드포인트 | 설명 |
|---|---|
| `GET /actuator/health` | 헬스 체크 |
| `GET /actuator/metrics` | 메트릭 목록 |
| `GET /actuator/prometheus` | Prometheus 스크래핑 엔드포인트 |
