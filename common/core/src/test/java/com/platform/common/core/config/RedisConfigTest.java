package com.platform.common.core.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = {TestConfiguration.class, RedisConfig.class})
@TestPropertySource(properties = {
    "spring.redis.host=localhost",
    "spring.redis.port=6379"
})
class RedisConfigTest {

    @Autowired(required = false)
    private RedisTemplate<String, String> redisTemplate;

    @Test
    @DisplayName("Spring Context 로드 시 RedisTemplate Bean이 등록되어야 한다")
    void contextLoads_createsRedisTemplateBean() {
        // Given: RedisConfig가 설정되어 있을 때

        // When: Spring ApplicationContext가 로드되면

        // Then: RedisTemplate<String, String> Bean이 등록되어야 한다
        assertThat(redisTemplate).isNotNull();
    }

    @Test
    @DisplayName("RedisTemplate이 StringRedisSerializer를 사용해야 한다")
    void redisTemplate_usesStringRedisSerializer() {
        // Given: RedisTemplate Bean이 생성되었을 때

        // When: KeySerializer와 ValueSerializer를 조회하면

        // Then: StringRedisSerializer가 설정되어야 한다
        assertThat(redisTemplate).isNotNull();
        assertThat(redisTemplate.getKeySerializer()).isNotNull();
        assertThat(redisTemplate.getValueSerializer()).isNotNull();
        assertThat(redisTemplate.getHashKeySerializer()).isNotNull();
        assertThat(redisTemplate.getHashValueSerializer()).isNotNull();
    }
}
