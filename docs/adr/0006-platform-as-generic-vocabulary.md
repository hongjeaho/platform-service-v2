# ADR-0006: "platform"은 발판의 generic 어휘 — 인스턴스 정체성은 설정으로만

- **상태(Status)**: 수락됨(Accepted)
- **날짜**: 2026-07-16
- **컨텍스트**: 발판(base) 리포 모델 / 인스턴스 정체성

## 배경(Context)

아키텍처 검토(candidate 2)에서 "platform"이라는 단어가 Java 패키지 80개 파일, 모듈명(`api-platform` 등), `settings.gradle` 스캐폴딩, yml 키에 산재해 있음이 확인되었다. 발판에서 분기한 새 리포(개인 서비스, 공공시스템)가 이를 전부 rename해야 한다면, 분기 절차가 grep 사냥이 되고 놓친 한 곳이 사고가 된다.

한편 진짜 인스턴스별로 달라야 하는 값은 따로 있다: `jwt.issuer`(ADR-0004), 프론트 브랜드명, CORS 허용 origin, 메일 발신 계정. 이 중 일부는 Java 상수(CORS)나 하드코딩(SMTP host, 브랜드명 3곳 중복)으로 박혀 있었다.

## 결정(Decision)

1. **`com.platform` 패키지·`*-platform` 모듈명·docker 리소스명의 "platform"은 인스턴스 이름이 아니라 발판의 generic 어휘로 선언한다.** 분기 리포는 rename하지 않는다 — Spring 프로젝트가 `org.springframework` 패키지를 rename하지 않고 쓰는 것과 같다. 이 선언으로 "80개 파일 rename" 마찰은 코드가 아닌 결정으로 소멸한다.
2. **인스턴스 정체성은 설정 값으로만 존재한다.** 분기 리포가 바꿔야 할 것:
   - `jwt.issuer` (`api/*/application.yml`) — ADR-0004
   - 프론트 브랜드명 — `.env`의 `VITE_APP_NAME` 하나. `index.html`(Vite `%VITE_APP_NAME%` 치환)·`src/config/brand.ts`(단일 config)·`AuthLayout`·`AppShell`이 전부 이를 소비한다. 컴포넌트에 브랜드 문자열 하드코딩 금지.
   - CORS 허용 origin — `cors.allowed-origins` 프로퍼티(콤마 구분, `CORS_ALLOWED_ORIGINS` env 오버라이드). Java 상수 금지 — 재컴파일 없이 변경 가능해야 한다.
   - 메일 발신 — `platform.email.*` + `spring.mail.host`(`PLATFORM_EMAIL_HOST` env 오버라이드, 기본 gmail).
3. **경로·설정의 단일 소스 원칙** — 같은 값이 두 파일에 살면 안 된다. actuator 경로는 `management.endpoints.web.base-path`(common-web yml)가 유일한 소스이고, `SecurityConfig`의 requestMatchers는 이 프로퍼티를 주입받아 구성한다(리터럴 중복 제거).
4. **환경 종속 값은 env 오버라이드 가능해야 한다** — dev 프로필의 업로드 절대경로(`/home/staff/filedownload/`) 등 특정 호스트 종속 값은 `${ENV:기본값}` 형태로 둔다.

## 결과(Consequences)

- **긍정**: 분기 절차가 "설정 값 몇 개 변경"으로 수렴 — `jwt.issuer`, `VITE_APP_NAME`, CORS origin, 메일 계정, DB 자격증명. 패키지 rename·스캐폴딩 수정·grep 사냥이 사라진다. 미래 아키텍처 리뷰가 rename을 재제안하지 않는다.
- **부정/비용**: 분기 리포의 코드에 "platform"이라는 단어가 남는다 — 내부 개발자에게 cosmetic한 위화감이 있을 수 있으나, 이는 발판 출신임을 나타내는 표식이기도 하다. 정말 rename하고 싶은 분기는 IDE rename으로 자기 책임 하에 수행하면 된다(발판은 지원하지 않는다).
