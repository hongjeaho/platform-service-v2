package com.platform.common.core.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Redis 연결 설정 Properties.
 *
 * <p>application.yml의 spring.redis 속성을 매핑한다.
 */
@ConfigurationProperties(prefix = "spring.redis")
public record RedisProperties(
    String host,
    int port,
    String password,
    int timeout
) {}
