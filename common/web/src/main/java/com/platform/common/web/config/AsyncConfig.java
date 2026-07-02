package com.platform.common.web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * 비동기 처리 Configuration.
 *
 * <p>이메일 발송 등 비동기 처리를 위한 스레드 풀을 구성한다.
 */
@Configuration
@EnableAsync
public class AsyncConfig {

    /**
     * 비동기 작업을 위한 스레드 풀.
     *
     * <p>이메일 발송 등 외부 I/O 작업을 비동기로 처리한다.
     * CorePoolSize: 5, MaxPoolSize: 10, QueueCapacity: 100
     */
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}
