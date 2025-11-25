# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Spring Boot multi-module application** for managing government land compensation adjudication processes. The system integrates with external APIs (LTIS, KAPA, Kakao Maps) and manages complex workflows involving multiple user roles, document processing, and administrative decision-making.

**Current Status:** Early scaffolding phase with complete infrastructure setup but minimal business logic implementation. Database schema (51 tables) and JOOQ code generation are fully configured. Service layer, controllers, and frontend are not yet implemented.

## Build System & Commands

This project uses **Gradle** with a multi-module structure. Use `gradlew.bat` on Windows.

### Core Development Commands

```bash
# Build all modules
./gradlew build

# Run the API server (port 8080)
./gradlew :api-platform:bootRun

# Run batch processing module
./gradlew :batch-platform:bootRun

# Run all tests
./gradlew test

# Run specific test class
./gradlew test --tests ClassName

# Run specific test method
./gradlew test --tests ClassName.methodName
```

### Database & JOOQ Commands

```bash
# Generate JOOQ code from database schema
./gradlew generateJooq

# Run Flyway migrations
./gradlew flywayMigrate

# Check migration status
./gradlew flywayInfo

# Clean database (remove all schema objects)
./gradlew flywayClean

# Combined: migrate then generate JOOQ code (do this when schema changes)
./gradlew generateJooqWithFlyway
```

**Environment Variables for Database Configuration:**

The following environment variables can be used to customize database connections for JOOQ code generation and Flyway migrations:

| Variable | Default | Description |
|----------|---------|-------------|
| `PLATFORM_DB_URL` | `jdbc:mysql://localhost:3306/store?useSSL=false&allowPublicKeyRetrieval=true` | JDBC connection URL |
| `PLATFORM_DB_USER` | `root` | Database username |
| `PLATFORM_DB_PWD` | `root` | Database password |

**Usage Examples:**

Windows:
```bash
set PLATFORM_DB_URL=jdbc:mysql://dev-server:3306/store
set PLATFORM_DB_USER=admin
set PLATFORM_DB_PWD=securePassword123
./gradlew generateJooq
```

Linux/Mac:
```bash
export PLATFORM_DB_URL=jdbc:mysql://dev-server:3306/store
export PLATFORM_DB_USER=admin
export PLATFORM_DB_PWD=securePassword123
./gradlew generateJooq
```

### Important Notes on JOOQ Generation

- JOOQ files are generated to `datasource-platform/src/generated/`
- **Package structure:**
  - Base: `com.platform.datasource.platform.jooq.generated`
  - Tables: `com.platform.datasource.platform.jooq.generated.tables`
  - POJOs: `com.platform.datasource.platform.jooq.generated.tables.pojos`
  - Records: `com.platform.datasource.platform.jooq.generated.tables.records`
  - DAOs: `com.platform.datasource.platform.jooq.generated.tables.daos`
- Custom naming strategy: tables use `J` prefix (e.g., `JUser`), POJOs use `Entity` suffix (e.g., `UserEntity`)
- The custom generator is in `common-jooq/src/main/java/com/platform/common/jooq/CustomGeneratorStrategy.java`
- **Package constants:** All package paths are centrally managed in `datasource-platform/src/main/java/com/platform/datasource/platform/jooq/JooqPackageConstants.java`
- Excludes Spring Batch tables (`batch_*`) and Flyway metadata tables

## High-Level Architecture

### Module Structure

```
spring-platform-v2/
├── api/platform/                 # REST API module (primary interface)
├── batch/platform/               # Spring Batch for async jobs & external API sync
├── common/
│   ├── core/                     # Core utilities, constants, exceptions
│   ├── jooq/                     # JOOQ custom code generation strategy
│   └── web/                      # Spring Security, JWT, web configuration
├── datasource/platform/          # Database layer with JOOQ + Flyway + MyBatis
└── front/platform/               # Frontend (React) - not yet implemented
```

### Module Dependencies

```
api-platform
  └── common-web
       └── common-core
            └── datasource-platform
```

### Database Access Strategy

**JOOQ (Type-Safe SQL):** Primary approach for most queries
- Compile-time SQL validation
- Type-safe query building
- Records and DAOs auto-generated from schema
- **Bean name:** `PLATFORM_DSL_CONTEXT` (inject with `@Qualifier`)
- **Generated code location:** `com.platform.datasource.platform.jooq.generated.*`

**MyBatis:** For complex queries where JOOQ DSL is insufficient
- Mapper files in `datasource-platform/src/main/resources/mybatis-mapper/`
- Mapper interfaces in `datasource-platform/src/main/java/com/platform/datasource/platform/mapper/`
- Type aliases configured for generated JOOQ POJOs and DTOs via `JooqPackageConstants.MYBATIS_TYPE_ALIASES_PACKAGE`
- **SqlSessionFactory bean name:** `PLATFORM_SQL_SESSION_FACTORY`
- Includes: `com.platform.datasource.platform.jooq.generated.tables.pojos.**`, `com.platform.datasource.platform.dto.**`

**Flyway:** Schema versioning and migrations
- Migration scripts in `datasource-platform/flyway/`
- Currently no migrations exist yet (pre-dev schema setup phase)

### Planned Architecture Pattern

The codebase is being structured for **CQRS (Command Query Responsibility Segregation)**:
- Separation between read and write operations
- Different optimization strategies for queries vs commands
- Not yet fully implemented - prepare services for this pattern

## Database Schema

The system includes 51 tables organized into logical domains:

- **System Code Management:** Code lookups for dropdowns and validations
- **User & Authorization:** Users, roles, role mappings
- **Admin Management:** District managers, committee members
- **LTIS Integration:** External land compensation data synchronization (8 tables for different data types)
- **File Management:** File storage, PDF image generation
- **Receipt Management:** Intake workflow, business info, assessments, attachments
- **Opinion Management:** 25 opinion templates, case templates, comments
- **Notice Management:** Official notifications and attachments
- **Conclusion/Review:** Decision outcomes and bookmarks
- **Deliberation:** Committee meetings, dates, targets
- **Reference Materials:** Decrees, precedents, conclusions
- **Public Land Price (KAPA):** Official price indices and temporary data
- **Board:** FAQ/announcement system with Q&A

## Development Methodology

Follow **Test-Driven Development (TDD)** principles from `docs/tdd.md` (Kent Beck methodology):

1. **Red → Green → Refactor cycle:**
   - Write smallest failing test
   - Write minimal code to pass
   - Refactor while keeping tests green

2. **Tidy First approach:**
   - Separate structural changes from behavioral changes
   - Different commit strategy for each type

3. **Small, frequent commits:**
   - Only commit when all tests pass
   - One logical change per commit

## 코딩 규칙

### 언어 규칙

- **모든 응답은 한글로만 작성합니다.** 코드, 테스트, 주석 등 모든 텍스트 응답이 한글이어야 합니다.

### Java 주석 규칙

- **JavaDoc 규칙을 준수합니다:**
  - 모든 public 클래스, 메서드, 필드는 JavaDoc 주석이 필수입니다.
  - 형식: `/** ... */` (한 줄은 `/** ... */`, 여러 줄은 `/** ... */`)
  - 클래스 주석: 클래스의 목적과 주요 역할 설명
  - 메서드 주석: 메서드의 목적, `@param`, `@return`, `@throws` 포함
  - 필드 주석: 필드의 의미와 역할 설명

  ```java
  /**
   * 사용자 정보를 관리하는 서비스입니다.
   * 사용자 조회, 생성, 수정, 삭제 기능을 제공합니다.
   */
  public class UserService {

      /**
       * 사용자 ID로 사용자 정보를 조회합니다.
       *
       * @param userId 조회할 사용자의 ID
       * @return 조회된 사용자 정보
       * @throws UserNotFoundException 사용자를 찾을 수 없는 경우
       */
      public UserEntity getUserById(Long userId) throws UserNotFoundException {
          // 구현...
      }
  }
  ```

- **구현 주석:** 복잡한 로직이나 비즈니스 규칙은 `//` 주석으로 설명합니다.
- 주석은 **항상 한글**로 작성합니다.

## Configuration & Profiles

### Active Profiles

**Local Profile (`local`):**
- Database: MySQL on localhost:3306, database `store`
- Credentials: root/root
- File uploads: `C:\filedownload\`

**Dev Profile (`dev`):**
- Database: store/passwordPassword123! (external server)
- File uploads: `/home/staff/filedownload/`

### Key Configuration Settings

**Server:**
- Port: 8080
- Tomcat max connections: 200, max threads: 200, min threads: 20
- Connection timeout: 20s

**Database (HikariCP):**
- Maximum pool size: 15
- Connection timeout: 30s
- Max lifetime: 30 minutes
- Auto-commit: false

**JWT Authentication:**
- Token expiration: 24 hours
- Renew before: 5 days
- Algorithm: HS256

**File Upload:**
- Max file size: 100MB
- Max request size: 100MB

**JOOQ:**
- DSLContext bean name: `PLATFORM_DSL_CONTEXT`
- ConnectionProvider bean name: `PLATFORM_CONNECTION_PROVIDER`
- ConfigurationCustomizer bean name: `PLATFORM_JOOQ_CONFIGURATION_CUSTOMIZER`
- Safety settings:
  - Throws exception on DELETE without WHERE clause
  - Throws exception on UPDATE without WHERE clause
  - Query timeout: 60 seconds
  - Batch size: 100

**MyBatis:**
- SqlSessionFactory bean name: `PLATFORM_SQL_SESSION_FACTORY`
- Type aliases for JOOQ entities and DTOs (centrally managed via `JooqPackageConstants`)
- Mapper location: `mybatis-mapper/**/*.xml`
- Mapper scan packages: `com.platform.datasource.platform.mapper`
- Automatic camelCase mapping enabled

## Technology Stack

**Spring Ecosystem:**
- Spring Boot 3.4.2
- Spring Security (JWT authentication)
- Spring Batch (async processing, external API sync)
- Spring WebFlux (reactive endpoints)
- Spring Data / Spring Scheduling

**Database & ORM:**
- MySQL 8.0.31
- JOOQ 3.19.18 (type-safe SQL)
- MyBatis 3.0.4 (complex queries)
- Flyway 9.22.0 (schema migration)

**Security:**
- JWT (auth0:java-jwt:3.16.0)
- Spring Security

**Utilities:**
- Lombok (boilerplate reduction)
- Caffeine (caching)
- Apache PDFBox (PDF generation)
- Jackson (JSON processing)

**Observability:**
- Springdoc OpenAPI 2.8.9 (Swagger UI)
- Actuator (monitoring endpoints)

**Reactive:**
- Reactor Core 3.7.7
- WebFlux for async operations

### Frontend Stack (Planned)

- React 19 with TypeScript
- Vite 7.x
- TailwindCSS 4.x
- React Query (@tanstack/react-query)
- Jotai (state management)
- Orval (OpenAPI client code generation)

## External API Integrations

### LTIS (Land Compensation Information System)

External service for official land compensation data. Integration via Spring WebClient.

Tables: `ltis_status` (master), `ltis_info`, `ltis_charge`, `ltis_ownr_info`, `ltis_recm_info`, `ltis_rept_info`, `ltis_rept_ownr_info`, `ltis_pnu`, `ltis_tmp`

### KAPA (Korea Appraisal Board)

Public land price information service.

Tables: `kapa_standard_price`, `kapa_standard_price_tmp`, `kapa_official_price`, `kapa_official_price_tmp`

### Kakao Map API

Geocoding and reverse geocoding for location-based features.

### WebClient Configuration

- Connection pool: max 30
- Connection timeout: 30 minutes
- Configured in `common-web` module

## Security & Authentication

**JWT Token-Based Authentication:**
- Token contains claims for user identity and roles
- 24-hour expiration
- Can be renewed 5 days before expiration

**Role-Based Access Control (RBAC):**
- `ADMIN`: System administration
- `DECISION`: Adjudication decision making
- `IMPLEMENTER`: Case implementation and document handling

**Spring Security Configuration:**
- Located in `common-web` module (not yet implemented)
- Will include JWT filter, authentication provider, security rules
- Currently only configuration files exist

## Component Scanning

The API application scans components from:
```java
com.platform.common.core
com.platform.datasource.platform
com.platform.common.web
com.platform.api.platform
```

Add new component packages to this list if creating new modules.

## JOOQ Package Management

JOOQ generated code package paths are centrally managed through `JooqPackageConstants.java` to ensure consistency across the application and facilitate package name changes.

### Package Structure

```
com.platform.datasource.platform.jooq.generated
├── tables/                           # JOOQ table DSL classes
│   ├── JUser.java                   # Example: J<TableName> classes
│   ├── JReceipt.java
│   ├── pojos/                       # Entity POJOs
│   │   ├── UserEntity.java          # <TableName>Entity POJOs
│   │   └── ReceiptEntity.java
│   ├── records/                     # JOOQ Record types
│   │   ├── UserRecord.java
│   │   └── ReceiptRecord.java
│   └── daos/                        # Data Access Objects
│       ├── UserDao.java
│       └── ReceiptDao.java
├── Keys.java                        # Foreign key definitions
└── DefaultCatalog.java              # Database catalog
```

### Bean Name Constants

Configuration classes use explicit bean name constants to avoid conflicts in multi-datasource environments:

**JooqConfig.java:**
```java
public static final String PLATFORM_JOOQ_CONFIGURATION_CUSTOMIZER = "platformJooqConfigurationCustomizer";
public static final String PLATFORM_CONNECTION_PROVIDER = "platformConnectionProvider";
public static final String PLATFORM_DSL_CONTEXT = "platformDslContext";
```

**PlatFormDatabaseSource.java:**
```java
public static final String PLATFORM_DATASOURCE = "platformDataSource";
public static final String PLATFORM_DATASOURCE_MANAGER = "platformTransactionManager";
public static final String PLATFORM_SQL_SESSION_FACTORY = "platformSqlSessionFactory";
public static final String PLATFORM_DOMAIN_JDBC_TEMPLATE = "platformDomainJdbcTemplate";
public static final String PLATFORM_DOMAIN_NAMED_PARAMETER_JDBC_OPERATIONS = "platformDomainNamedParameterJdbcOperations";
```

### Package Constants Reference

All JOOQ package paths are defined in `JooqPackageConstants.java`:

```java
public static final String JOOQ_GENERATED_BASE = "com.platform.datasource.platform.jooq.generated";
public static final String JOOQ_POJO_PACKAGE = "com.platform.datasource.platform.jooq.generated.tables.pojos";
public static final String DTO_PACKAGE = "com.platform.datasource.platform.dto";
public static final String MYBATIS_TYPE_ALIASES_PACKAGE = "com.platform.datasource.platform.jooq.generated.tables.pojos.**,com.platform.datasource.platform.dto.**";
```

### Usage Example

```java
import org.springframework.stereotype.Repository;
import org.jooq.DSLContext;
import lombok.RequiredArgsConstructor;
import com.platform.datasource.platform.jooq.generated.tables.JReceipt;
import com.platform.datasource.platform.jooq.generated.tables.pojos.ReceiptEntity;
import com.platform.datasource.platform.config.database.PlatformTransactional;

/**
 * 접수 정보 조회 저장소입니다.
 */
@Repository
@PlatformTransactional
@RequiredArgsConstructor
public class ReceiptReadRepository {

    private final DSLContext dslContext;
    private final JReceipt RECEIPT = JReceipt.RECEIPT;

    /**
     * 접수 목록을 조회합니다.
     *
     * @return 접수 정보 목록
     */
    public List<ReceiptEntity> findAll() {
        return dslContext.select(RECEIPT.fields())
                .from(RECEIPT)
                .fetchInto(ReceiptEntity.class);
    }

    /**
     * 접수 ID로 접수 정보를 조회합니다.
     *
     * @param receiptId 접수 ID
     * @return 접수 정보
     */
    public ReceiptEntity findById(Long receiptId) {
        return dslContext.select(RECEIPT.fields())
                .from(RECEIPT)
                .where(RECEIPT.RECEIPT_ID.eq(receiptId))
                .fetchOneInto(ReceiptEntity.class);
    }
}
```

## Common Development Tasks

### Adding a New Entity

1. Add table definition to appropriate Flyway migration script
2. Run `./gradlew generateJooqWithFlyway` to:
   - Execute migrations
   - Generate JOOQ files (table, record, POJO, DAO)
3. Create POJO mapping in `datasource-platform/src/main/java/com/platform/datasource/platform/dto/` if custom fields needed
4. Create repository interface using JOOQ DSL and DAOs

**Example usage after generation:**

```java
import org.springframework.stereotype.Repository;
import org.jooq.DSLContext;
import lombok.RequiredArgsConstructor;
import com.platform.datasource.platform.jooq.generated.tables.JUser;
import com.platform.datasource.platform.jooq.generated.tables.pojos.UserEntity;
import com.platform.datasource.platform.config.database.PlatformTransactional;

/**
 * 사용자 정보를 관리하는 저장소입니다.
 */
@Repository
@PlatformTransactional
@RequiredArgsConstructor
public class UserReadRepository {

    private final DSLContext dslContext;
    private final JUser USER = JUser.USER;

    /**
     * 사용자 ID로 사용자를 조회합니다.
     *
     * @param userId 사용자 ID
     * @return 사용자 정보
     */
    public UserEntity findById(String userId) {
        return dslContext.select(USER.fields())
                .from(USER)
                .where(USER.USER_ID.eq(userId))
                .fetchOneInto(UserEntity.class);
    }

    /**
     * 모든 사용자를 조회합니다.
     *
     * @return 사용자 정보 목록
     */
    public List<UserEntity> findAll() {
        return dslContext.select(USER.fields())
                .from(USER)
                .fetchInto(UserEntity.class);
    }
}
```

### Running Database Migrations

```bash
# First time setup
./gradlew flywayMigrate

# After adding new migration files
./gradlew flywayMigrate
./gradlew generateJooq
```

### Adding a New REST Endpoint

1. Create controller in `api-platform/src/main/java/com/platform/api/platform/controller/`
2. Create service in `api-platform/src/main/java/com/platform/api/platform/service/`
3. Use JOOQ/MyBatis repositories from datasource layer
4. Add REST annotations (@RestController, @RequestMapping, etc.)
5. Write tests first (TDD)

### Testing

```bash
# Run all tests
./gradlew test

# Run tests with coverage report
./gradlew test jacocoTestReport

# Run specific test
./gradlew test --tests com.platform.api.platform.SomeTest

# Run specific test method
./gradlew test --tests com.platform.api.platform.SomeTest.testMethod
```

## Quick Reference: Common Imports and Patterns

### JOOQ Imports

```java
// DSLContext and qualifiers
import org.jooq.DSLContext;
import static com.platform.datasource.platform.config.JooqConfig.PLATFORM_DSL_CONTEXT;

// Generated tables
import com.platform.datasource.platform.jooq.generated.tables.JUser;
import com.platform.datasource.platform.jooq.generated.tables.JReceipt;
import com.platform.datasource.platform.jooq.generated.tables.JSystemCode;

// Generated POJOs (Entities)
import com.platform.datasource.platform.jooq.generated.tables.pojos.UserEntity;
import com.platform.datasource.platform.jooq.generated.tables.pojos.ReceiptEntity;

// Generated Records
import com.platform.datasource.platform.jooq.generated.tables.records.UserRecord;

// Package constants
import com.platform.datasource.platform.jooq.JooqPackageConstants;
```

### Repository 패턴

```java
// 저장소 기본 구조
import org.springframework.stereotype.Repository;
import org.jooq.DSLContext;
import lombok.RequiredArgsConstructor;
import com.platform.datasource.platform.config.database.PlatformTransactional;

@Repository
@PlatformTransactional
@RequiredArgsConstructor
public class MyReadRepository {

    private final DSLContext dslContext;

    // 테이블 인스턴스 필드로 선언
    private final JUser USER = JUser.USER;
    private final JReceipt RECEIPT = JReceipt.RECEIPT;

    // 쿼리 메서드들...
}
```

### Common Query Patterns

```java
// 필드 선언
private final JUser USER = JUser.USER;

// SELECT all - POJO로 변환
dslContext.select(USER.fields())
    .from(USER)
    .fetchInto(UserEntity.class);

// SELECT with WHERE
dslContext.select(USER.fields())
    .from(USER)
    .where(USER.USER_ID.eq("admin"))
    .fetchOneInto(UserEntity.class);

// SELECT 한 건 조회
dslContext.select(USER.fields())
    .from(USER)
    .where(USER.SEQ.eq(1L))
    .fetchOneInto(UserEntity.class);

// SELECT 여러 건 조회
List<UserEntity> users = dslContext.select(USER.fields())
    .from(USER)
    .where(USER.STATUS.eq("ACTIVE"))
    .fetchInto(UserEntity.class);

// INSERT
dslContext.insertInto(USER)
    .set(USER.USER_ID, "newuser")
    .set(USER.USER_NAME, "새사용자")
    .execute();

// UPDATE
dslContext.update(USER)
    .set(USER.USER_NAME, "수정된이름")
    .where(USER.USER_ID.eq("admin"))
    .execute();

// DELETE
dslContext.delete(USER)
    .where(USER.USER_ID.eq("admin"))
    .execute();

// COUNT
long count = dslContext.selectCount()
    .from(USER)
    .where(USER.STATUS.eq("ACTIVE"))
    .fetchOne(count());
```

## Important Notes

- The `docs/prd.md` contains the detailed product requirements (in Korean)
- The `docs/erd.md` shows complete database entity relationships
- The `docs/api.md` documents the planned REST API (theoretical, not all implemented)
- Check `docs/tdd.md` for development methodology guidelines
- File uploads are stored locally; ensure the configured directory exists and is writable
- The project uses MySQL 8.0+ specific features; ensure compatible database version
