package com.platform.datasource.platform.config;

import static com.platform.datasource.platform.config.database.PlatFormDatabaseSource.PLATFORM_DATASOURCE;

import com.platform.datasource.platform.config.database.PlatFormDatabaseSource;
import javax.sql.DataSource;
import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.conf.ExecuteWithoutWhere;
import org.jooq.impl.DSL;
import org.jooq.impl.DataSourceConnectionProvider;
import org.jooq.impl.DefaultConfiguration;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jooq.DefaultConfigurationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.datasource.TransactionAwareDataSourceProxy;

/**
 * JOOQ 설정 클래스
 * 이 클래스는 타입 안전한 SQL 쿼리 구성을 제공하는 데이터베이스 액세스 라이브러리인 JOOQ를 구성합니다.
 * JOOQ를 사용한 데이터베이스 작업에 필요한 빈과 설정을 설정합니다.
 * 주요 기능:
 * - WHERE 절 없는 실수로 인한 업데이트/삭제를 방지하기 위한 안전 설정 구성
 * - 데이터베이스 액세스를 위한 연결 제공자 설정
 * - JOOQ 작업의 주요 진입점인 DSLContext 생성 및 구성
 * - 애플리케이션의 데이터 소스를 활용하기 위해 PlatFormDatabaseSource 가져오기
 * 이 구성은 애플리케이션의 데이터 액세스 계층에 대한 적절한 안전 조치와
 * 성능 설정으로 적절한 데이터베이스 연결을 보장합니다.
 */
@Configuration
@Import(PlatFormDatabaseSource.class)
public class JooqConfig {

    /**
     * JOOQ 빈 이름 상수들
     */
    public static final String PLATFORM_JOOQ_CONFIGURATION_CUSTOMIZER = "platformJooqConfigurationCustomizer";
    public static final String PLATFORM_CONNECTION_PROVIDER = "platformConnectionProvider";
    public static final String PLATFORM_DSL_CONTEXT = "platformDslContext";

    /**
     * 안전성과 성능을 위한 JOOQ 설정 구성
     * 이 빈은 중요한 안전성 및 성능 설정으로 JOOQ 구성을 사용자 정의합니다:
     * - WHERE 절 없는 실수로 인한 DELETE 작업 방지
     * - WHERE 절 없는 실수로 인한 UPDATE 작업 방지
     * - SQL 쿼리에서 스키마 렌더링 비활성화
     * - 가독성을 위한 형식화된 SQL 로깅 활성화
     * - 최적화된 배치 작업을 위한 배치 크기 설정
     * - 장시간 실행 쿼리를 방지하기 위한 쿼리 타임아웃 설정
     * 
     * @return 이러한 설정을 JOOQ에 적용하는 DefaultConfigurationCustomizer
     */
    @Bean(PLATFORM_JOOQ_CONFIGURATION_CUSTOMIZER)
    public DefaultConfigurationCustomizer platformJooqConfigurationCustomizer() {
        return (configuration) -> configuration.settings()
                .withExecuteDeleteWithoutWhere(ExecuteWithoutWhere.THROW)     // 조건절 없이 delete 발생시 예외 발생
                .withRenderSchema(false)                                // 스키마 이름을 sql 에 포함 하지 않음
                .withExecuteUpdateWithoutWhere(ExecuteWithoutWhere.THROW)     // 조건절 없이 update 발생시 예외 발생
                .withRenderFormatted(true)                              // SQL 로깅 포맷팅
                .withBatchSize(100)                                     // 배치 크기 설정
                .withQueryTimeout(60);                                  // SQL 실행 타임아웃;
    }

    /**
     * JOOQ 데이터베이스 작업을 위한 연결 제공자 생성
     * 이 빈은 JOOQ가 데이터베이스에 연결하는 데 사용하는 DataSourceConnectionProvider를 생성합니다.
     * 애플리케이션의 DataSource를 TransactionAwareDataSourceProxy로 래핑하여
     * JOOQ 작업이 Spring 관리 트랜잭션에 적절하게 참여하도록 보장합니다.
     * 
     * @param dataSource PLATFORM_DATASOURCE로 한정된 플랫폼의 DataSource
     * @return JOOQ가 데이터베이스 연결에 사용할 DataSourceConnectionProvider
     */
    @Bean(PLATFORM_CONNECTION_PROVIDER)
    public DataSourceConnectionProvider platformConnectionProvider(
            @Qualifier(PLATFORM_DATASOURCE) DataSource dataSource) {
        return new DataSourceConnectionProvider(new TransactionAwareDataSourceProxy(dataSource));
    }

    /**
     * 데이터베이스 작업을 위한 주요 JOOQ DSLContext 생성
     * 이 빈은 JOOQ 작업의 주요 진입점인 DSLContext를 생성합니다.
     * DSLContext를 다음과 같이 구성합니다:
     * - 적절한 SQL 구문 생성을 위한 MySQL SQL 방언
     * - 데이터베이스 액세스를 위한 연결 제공자
     * - defaultConfigurationCustomizer의 모든 안전성 및 성능 설정
     * DSLContext는 타입 안전한 SQL 쿼리를 구축하고 실행하기 위한 유연한 API를 제공합니다.
     * 
     * @param connectionProvider 데이터베이스 액세스를 위한 연결 제공자
     * @param configurationCustomizer JOOQ 구성 설정을 위한 사용자 정의자
     * @return 데이터베이스 작업을 위해 완전히 구성된 DSLContext
     */
    @Bean(PLATFORM_DSL_CONTEXT)
    public DSLContext platformDslContext(
            @Qualifier(PLATFORM_CONNECTION_PROVIDER) DataSourceConnectionProvider connectionProvider,
            @Qualifier(PLATFORM_JOOQ_CONFIGURATION_CUSTOMIZER) DefaultConfigurationCustomizer configurationCustomizer
    ) {
        DefaultConfiguration jooqConfiguration = new DefaultConfiguration();
        jooqConfiguration.setSQLDialect(SQLDialect.MYSQL);
        jooqConfiguration.set(connectionProvider);

        configurationCustomizer.customize(jooqConfiguration);
        return DSL.using(jooqConfiguration);
    }
}
