package com.platform.datasource.platform.config.database;

import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * 플랫폼 데이터베이스 설정
 * 
 * 이 클래스는 플랫폼 도메인을 위한 데이터베이스 연결을 구성합니다.
 * 다음을 포함한 데이터베이스 작업에 필요한 빈을 설정합니다:
 * - HikariCP 연결 풀을 사용한 데이터 소스 구성
 * - 트랜잭션 관리
 * - 데이터베이스 작업을 위한 JDBC 템플릿
 * 
 * 이 클래스는 Spring Boot가 자동으로 데이터소스를 구성하는 것을 방지하기 위해
 * 자동 구성을 제외하여 여러 데이터 소스의 수동 구성을 가능하게 합니다.
 */
@EnableTransactionManagement
@EnableAutoConfiguration(exclude = {
        DataSourceAutoConfiguration.class,
        DataSourceTransactionManagerAutoConfiguration.class,
        MybatisAutoConfiguration.class})
@Configuration
public class PlatFormDatabaseSource {
    /**
     * 플랫폼 데이터 소스의 빈 이름
     * 데이터 소스를 주입할 때 한정자로 사용됨
     */
    public final static String PLATFORM_DATASOURCE = "platformDataSource";

    /**
     * 플랫폼 트랜잭션 관리자의 빈 이름
     * 플랫폼 도메인에서 트랜잭션을 관리하는 데 사용됨
     */
    public final static String PLATFORM_DATASOURCE_MANAGER = "platformTransactionManager";

    /**
     * 플랫폼 JDBC 템플릿의 빈 이름
     * 표준 JDBC 작업으로 SQL 쿼리를 실행하는 데 사용됨
     */
    public static final String PLATFORM_DOMAIN_JDBC_TEMPLATE = "platformDomainJdbcTemplate";

    /**
     * 플랫폼 명명된 매개변수 JDBC 작업의 빈 이름
     * 명명된 매개변수를 사용하여 SQL 쿼리를 실행하는 데 사용됨
     */
    public static final String PLATFORM_DOMAIN_NAMED_PARAMETER_JDBC_OPERATIONS = "platformDomainNamedParameterJdbcOperations";

    /**
     * 플랫폼 SQL 세션 팩토리의 빈 이름
     * MyBatis SqlSessionFactory 생성 및 관리에 사용됨
     */
    public static final String PLATFORM_SQL_SESSION_FACTORY = "platformSqlSessionFactory";

    /**
     * 플랫폼 데이터 소스를 생성하고 구성함
     * 
     * @return 'platform.domain.datasource' 속성으로 구성된 HikariCP 데이터 소스
     */
    @Bean(PLATFORM_DATASOURCE)
    @ConfigurationProperties("platform.domain.datasource")
    public DataSource platformdatasource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    /**
     * 플랫폼 데이터 소스를 위한 트랜잭션 관리자를 생성함
     * 
     * @param dataSource 트랜잭션을 관리할 플랫폼 데이터 소스
     * @return 플랫폼 데이터 소스를 위한 DataSourceTransactionManager
     */
    @Bean(PLATFORM_DATASOURCE_MANAGER)
    public PlatformTransactionManager platFormTransactionManager(@Qualifier(PLATFORM_DATASOURCE) final DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    /**
     * 플랫폼 데이터 소스를 위한 NamedParameterJdbcTemplate을 생성함
     * 이를 통해 SQL 쿼리에서 위치 매개변수 대신 명명된 매개변수(예: :paramName)를 사용할 수 있음
     * 
     * @return 플랫폼 데이터 소스를 위한 NamedParameterJdbcOperations 인스턴스
     */
    @Bean(name = PLATFORM_DOMAIN_NAMED_PARAMETER_JDBC_OPERATIONS)
    public NamedParameterJdbcOperations platFormDomainNamedParameterJdbcOperations() {
        return new NamedParameterJdbcTemplate(platformdatasource());
    }

    /**
     * 플랫폼 데이터 소스를 위한 표준 JdbcTemplate을 생성함
     * 이는 표준 JDBC 작업으로 SQL 쿼리를 실행하기 위한 더 간단한 인터페이스를 제공함
     * 
     * @param dataSource 템플릿을 생성할 플랫폼 데이터 소스
     * @return 플랫폼 데이터 소스를 위한 JdbcTemplate 인스턴스
     */
    @Bean(name = PLATFORM_DOMAIN_JDBC_TEMPLATE)
    public JdbcTemplate platFormDomainJdbcTemplate(
            @Qualifier(PLATFORM_DATASOURCE) final DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
