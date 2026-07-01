package com.platform.common.web.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Import;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import org.junit.jupiter.api.extension.ExtendWith;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@Import(AsyncConfig.class)
class AsyncConfigTest {

    @Autowired(required = false)
    @Qualifier("taskExecutor")
    private TaskExecutor taskExecutor;

    @Test
    @DisplayName("Spring Context 로드 시 ThreadPoolTaskExecutor Bean이 등록되어야 한다")
    void contextLoads_createsTaskExecutorBean() {
        // Given: AsyncConfig가 설정되어 있을 때

        // When: Spring ApplicationContext가 로드되면

        // Then: ThreadPoolTaskExecutor Bean이 등록되어야 한다
        assertThat(taskExecutor).isNotNull();
    }

    @Test
    @DisplayName("ThreadPoolTaskExecutor가 올바른 설정으로 생성되어야 한다")
    void taskExecutor_hasCorrectConfiguration() {
        // Given: ThreadPoolTaskExecutor Bean이 생성되었을 때

        // When: CorePoolSize, MaxPoolSize, QueueCapacity를 조회하면

        // Then: 각각 5, 10, 100이어야 한다
        assertThat(taskExecutor).isNotNull();
        ThreadPoolTaskExecutor executor = (ThreadPoolTaskExecutor) taskExecutor;
        assertThat(executor.getCorePoolSize()).isEqualTo(5);
        assertThat(executor.getMaxPoolSize()).isEqualTo(10);
        assertThat(executor.getQueueCapacity()).isEqualTo(100);
    }
}
