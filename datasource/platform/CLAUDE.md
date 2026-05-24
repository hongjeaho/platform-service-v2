# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Module Overview

`datasource/platform`은 데이터 접근 계층 전담 모듈입니다.
`api/platform`을 비롯한 상위 모듈에 Repository, Mapper, 트랜잭션 어노테이션을 제공합니다.

- **JOOQ**: 타입 안전 SQL — 기본 쿼리에 사용
- **MyBatis**: 복잡한 동적 쿼리 — JOOQ DSL로 표현하기 어려울 때만 사용
- **Flyway**: 스키마 버전 관리 (`datasource/platform/flyway/`)
- **`@PlatformTransactional`**: 이 모듈에서 정의한 트랜잭션 어노테이션

**선택 기준 — JOOQ vs MyBatis**:
- JOOQ: 단건 조회, 조인, 집계 등 대부분의 쿼리
- MyBatis: 동적 조건이 수십 개인 검색 쿼리처럼 JOOQ DSL로 표현하기 어려운 경우에만

## 디렉토리 구조

```
datasource/platform/
├── flyway/                          # Flyway 마이그레이션 SQL
│   └── V{yyyyMMddHHmmss}__{설명}.sql
└── src/main/java/.../datasource/platform/
    ├── config/
    │   ├── JooqConfig.java          # JOOQ DSLContext 설정
    │   ├── MybatisConfig.java       # MyBatis 설정 (TypeAlias 등)
    │   └── database/
    │       ├── PlatformDatabaseSource.java   # DataSource 빈
    │       └── PlatformTransactional.java    # 커스텀 트랜잭션 어노테이션
    ├── jooq/
    │   ├── JooqPackageConstants.java         # 패키지 경로 상수
    │   └── generated/                        # JOOQ 자동 생성 코드 (수동 수정 금지)
    │       ├── tables/J{TableName}.java      # 테이블 클래스
    │       └── tables/pojos/{Name}Entity.java # POJO
    ├── repository/{domain}/
    │   └── {Domain}Repository.java           # JOOQ 기반 Repository
    └── mapper/{domain}/
        └── {Domain}Mapper.java               # MyBatis Mapper 인터페이스
```

MyBatis XML: `src/main/resources/mybatis-mapper/{domain}/{Domain}Mapper.xml`

---

## JOOQ 패턴

### 코드 생성 규칙 (`CustomGeneratorStrategy`)

| 대상 | 생성 클래스명 | 예시 |
|---|---|---|
| 테이블 | `J{TableName}` | `JUser`, `JCaseInfo` |
| POJO | `{TableName}Entity` | `UserEntity`, `CaseInfoEntity` |
| POJO 패키지 | `...jooq.generated.tables.pojos` | — |

JOOQ 코드 재생성: `./gradlew :datasource:platform:generateJooq`
생성된 코드는 **수동으로 수정하지 않습니다.**

### Repository 작성 패턴

```
@Repository
@RequiredArgsConstructor
public class CaseRepository {

    private final DSLContext dslContext;

    // 테이블 인스턴스는 필드로 선언 (재사용)
    private final JCaseInfo CASE = JCaseInfo.CASE_INFO;

    // 단건 조회
    public CaseInfoEntity findById(Long id) {
        return dslContext
            .select(CASE.fields())
            .from(CASE)
            .where(CASE.SEQ.eq(id))
            .fetchOneInto(CaseInfoEntity.class);
    }

    // 목록 조회
    public List<CaseInfoEntity> findAll() {
        return dslContext
            .select(CASE.fields())
            .from(CASE)
            .fetchInto(CaseInfoEntity.class);
    }

    // 1:N 조인 그룹핑
    public Map<CaseInfoEntity, List<AttachmentEntity>> findWithAttachments(Long id) {
        return dslContext
            .select(CASE.fields(), ATTACHMENT.fields())
            .from(CASE)
            .join(ATTACHMENT).on(CASE.SEQ.eq(ATTACHMENT.CASE_SEQ))
            .where(CASE.SEQ.eq(id))
            .fetchGroups(
                record -> record.into(CaseInfoEntity.class),
                record -> record.into(AttachmentEntity.class)
            );
    }
}
```

### JOOQ 쿼리 작성 규칙

- 테이블 인스턴스는 Repository 필드로 선언 (`private final JUser USER = JUser.USER`)
- 결과 매핑은 `fetchOneInto()` / `fetchInto()` / `fetchGroups()` 사용
- `fetchOne()`으로 null 반환 가능 시 Optional로 감싸거나 null 체크
- 대량 삽입은 `dslContext.batchInsert()` 사용

---

## MyBatis 패턴

### 사용 시점

JOOQ를 기본으로 사용하고, 아래 경우에만 MyBatis 사용:
- 수십 개의 동적 조건이 있는 검색 쿼리 (`<if>`, `<choose>` 조합)
- JOOQ DSL로 표현하기 어려운 복잡한 서브쿼리·피벗

### Mapper 작성 패턴

```
// 인터페이스: datasource/platform/src/main/java/.../mapper/{domain}/
@Mapper
public interface CaseMapper {
    List<CaseInfoEntity> searchCases(CaseSearchCondition condition);
    int countCases(CaseSearchCondition condition);
}
```

```xml
<!-- XML: src/main/resources/mybatis-mapper/{domain}/CaseMapper.xml -->
<mapper namespace="com.platform.datasource.platform.mapper.case.CaseMapper">
    <select id="searchCases" resultType="CaseInfoEntity">
        SELECT * FROM case_info
        <where>
            <if test="status != null">AND status = #{status}</if>
            <if test="keyword != null">AND title LIKE CONCAT('%', #{keyword}, '%')</if>
        </where>
        LIMIT #{pageSize} OFFSET #{page}
    </select>
</mapper>
```

### TypeAlias 설정

`JooqPackageConstants.MYBATIS_TYPE_ALIASES_PACKAGE`에 JOOQ POJO 패키지가 등록되어 있어
XML에서 JOOQ POJO를 **클래스명 그대로** 사용할 수 있습니다:

```
resultType="UserEntity"                 <!-- ✅ 클래스명만 -->
resultType="com.platform...UserEntity"  <!-- ❌ 풀네임 불필요 -->
```

---

## 트랜잭션 (`@PlatformTransactional`)

이 모듈에서 정의한 커스텀 어노테이션. `@Transactional(PLATFORM_DATASOURCE_MANAGER)`의 단축형.

```
@PlatformTransactional              // 쓰기 (기본, timeout=30s)
@PlatformTransactional(readOnly = true)   // 읽기 전용
@PlatformTransactional(timeout = 60)      // 타임아웃 조정
@PlatformTransactional(rollbackFor = CustomException.class)  // 롤백 조건 추가
```

**적용 위치**: `api/platform`의 Service 메서드에만 사용.
Repository / Helper에는 적용하지 않습니다.

---

## Flyway 마이그레이션

위치: `datasource/platform/flyway/`

### 파일명 규칙

```
V{yyyyMMddHHmmss}__{설명}.sql

V20260524143000__create_case_info_table.sql    ✅ DDL
V20260524143001__insert_case_status_code.sql   ✅ DML
V1__create_case.sql                            ❌ 순번 기반 금지 (병렬 개발 시 충돌)
```

### 작성 규칙

- 배포된 파일 **수정 금지** — 변경이 필요하면 새 버전 파일 추가
- DDL(`CREATE`, `ALTER`)과 DML(`INSERT`, `UPDATE`)을 같은 파일에 혼합 금지
- 컬럼 추가·삭제 시 기존 데이터 영향 여부를 반드시 확인 후 작성
- 롤백이 필요한 경우 별도 `U{버전}__rollback_{설명}.sql` 작성

### 실행 확인

```bash
# 마이그레이션 히스토리 확인 (flyway_schema_history 테이블)
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC;
```

---

## 네이밍 규칙

| 대상 | 규칙 | 예시 |
|---|---|---|
| JOOQ 테이블 클래스 | `J{TableName}` (PascalCase) | `JUser`, `JCaseInfo` |
| JOOQ POJO | `{TableName}Entity` | `UserEntity`, `CaseInfoEntity` |
| Repository | `{Domain}Repository` | `CaseRepository` |
| MyBatis Mapper | `{Domain}Mapper` | `CaseMapper` |
| Mapper XML | `{Domain}Mapper.xml` | `CaseMapper.xml` |
| Flyway 파일 | `V{yyyyMMddHHmmss}__{설명}.sql` | `V20260524143000__create_case_table.sql` |
