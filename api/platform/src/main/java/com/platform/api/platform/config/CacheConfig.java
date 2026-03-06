package com.platform.api.platform.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.platform.api.platform.config.cache.CacheNames;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.binder.cache.CaffeineCacheMetrics;
import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 커스텀 캐시 설정 - LoadingCache 지원 refreshAfterWrite 기능을 사용하기 위한 LoadingCache 구성
 * <p>
 * 현재 설정된 캐시: - caseTemplate: 케이스 템플릿 캐시
 * <p>
 * 새로운 캐시가 필요한 경우 createCache() 메서드를 참고하여 추가
 */
@Slf4j
@Configuration
@EnableCaching
public class CacheConfig {

  @Bean
  public CacheManager cacheManager(Optional<MeterRegistry> meterRegistry) {
    SimpleCacheManager cacheManager = new SimpleCacheManager();

    // 캐시 목록 정의
    List<Cache> caches = List.of(
        createCaseTemplateCache() // 새로운 캐시가 필요하면 여기에 추가
    );

    // 캐시 메트릭 등록 (Actuator 모니터링) - MeterRegistry가 있을 때만 등록
    meterRegistry.ifPresent(registry -> caches.forEach(cache -> {
      CaffeineCache caffeineCache = (CaffeineCache) cache;
      com.github.benmanes.caffeine.cache.Cache<Object, Object> nativeCache = caffeineCache.getNativeCache();
      CaffeineCacheMetrics.monitor(registry, nativeCache, cache.getName());
      log.info("Cache metrics registered for: {}", cache.getName());
    }));

    cacheManager.setCaches(caches);

    String cacheNames = caches.stream()
        .map(Cache::getName)
        .collect(Collectors.joining(", "));
    log.info("Cache manager initialized with caches: [{}]", cacheNames);

    return cacheManager;
  }

  /**
   * caseTemplate 캐시 생성
   * <p>
   * 캐시 만료 정책: - expireAfterWrite: 10분 - 캐시 데이터가 생성되거나 업데이트된 후 10분이 지나면 자동 만료 - expireAfterAccess: 30분 - 캐시 데이터에 마지막으로 접근한 후 30분이 지나면 자동 만료 - maximumSize: 2000 - 최대 2000개의 캐시 엔트리만 보관
   */
  private Cache createCaseTemplateCache() {
    com.github.benmanes.caffeine.cache.Cache<Object, Object> cache = Caffeine.newBuilder()
        .expireAfterWrite(Duration.ofMinutes(10))
        .expireAfterAccess(Duration.ofMinutes(30))
        .maximumSize(2000)
        .recordStats()
        .build();

    return new CaffeineCache(CacheNames.OPINION_TEMPLATE_CACHE_NAME, cache);
  }
}
