package com.platform.common.web.config;

import com.platform.common.web.config.converter.LocalDateConverter;
import com.platform.common.web.config.converter.LocalDateTimeConverter;
import com.platform.common.web.config.resolver.AuditingHandlerMethodArgumentResolver;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.lang.NonNull;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final AuditingHandlerMethodArgumentResolver auditingHandlerMethodArgumentResolver;

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new LocalDateConverter());
        registry.addConverter(new LocalDateTimeConverter());
    }

    @Override
    public void addArgumentResolvers(@NonNull List<HandlerMethodArgumentResolver> resolvers) {
        WebMvcConfigurer.super.addArgumentResolvers(resolvers);
        resolvers.add(auditingHandlerMethodArgumentResolver);
    }
}
