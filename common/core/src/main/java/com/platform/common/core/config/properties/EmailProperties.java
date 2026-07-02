package com.platform.common.core.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * platform.email 설정 바인딩.
 *
 * @param from     발신자 이메일 주소
 * @param fromName 발신자 표시 이름
 */
@ConfigurationProperties("platform.email")
public record EmailProperties(
        String from,
        String fromName
) {}
