package com.platform.common.core.config;

import com.platform.common.core.config.properties.EmailProperties;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.ssl.SslBundle;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.util.StringUtils;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import java.util.Map;
import java.util.Properties;

/**
 * 이메일 발송에 필요한 Bean을 구성한다.
 *
 * <p>{@link JavaMailSender}는 소비 모듈(api/platform 등)이 {@code spring.mail.*} 설정을 제공할 때 생성된다.
 * 데이터소스 라이브러리가 {@code spring.datasource.*}를 소비 모듈에서 받는 것과 동일한 패턴이다.
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties({EmailProperties.class, MailProperties.class})
public class EmailConfig {

    /**
     * 이메일 전용 Thymeleaf 엔진.
     *
     * <p>ClassLoaderTemplateResolver로 classpath:/templates/email/ 경로만 탐색하여
     * 웹 MVC 뷰 엔진과 경로 충돌을 방지한다.
     */
    @Bean("emailTemplateEngine")
    public SpringTemplateEngine emailTemplateEngine() {
        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
        resolver.setPrefix("templates/email/");
        resolver.setSuffix(".html");
        resolver.setTemplateMode("HTML");
        resolver.setCharacterEncoding("UTF-8");
        resolver.setCacheable(true);

        SpringTemplateEngine engine = new SpringTemplateEngine();
        engine.setTemplateResolver(resolver);
        return engine;
    }

    /**
     * {@code spring.mail.host}가 설정된 경우 {@link JavaMailSenderImpl} 빈을 생성한다.
     *
     * <p>소비 모듈이 {@code spring.mail.*} 설정을 제공하고, 이 빈은 그 설정을 소비한다.
     * {@link org.springframework.boot.autoconfigure.mail.MailSenderAutoConfiguration}의
     * {@code @ConditionalOnMissingBean(MailSender.class)} 조건에 의해 자동 구성과 충돌하지 않는다.
     */
    @Bean
    @ConditionalOnMissingBean(JavaMailSender.class)
    @ConditionalOnProperty(prefix = "spring.mail", name = "host")
    public JavaMailSenderImpl javaMailSender(MailProperties properties,
                                             ObjectProvider<SslBundles> sslBundles) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        applyProperties(properties, sender, sslBundles.getIfAvailable());
        return sender;
    }

    private void applyProperties(MailProperties properties, JavaMailSenderImpl sender, SslBundles sslBundles) {
        sender.setHost(properties.getHost());
        if (properties.getPort() != null) {
            sender.setPort(properties.getPort());
        }
        sender.setUsername(properties.getUsername());
        sender.setPassword(properties.getPassword());
        sender.setProtocol(properties.getProtocol());
        if (properties.getDefaultEncoding() != null) {
            sender.setDefaultEncoding(properties.getDefaultEncoding().name());
        }
        Properties javaMailProperties = asProperties(properties.getProperties());
        String protocol = StringUtils.hasLength(properties.getProtocol()) ? properties.getProtocol() : "smtp";
        MailProperties.Ssl ssl = properties.getSsl();
        if (ssl.isEnabled()) {
            javaMailProperties.setProperty("mail." + protocol + ".ssl.enable", "true");
        }
        if (ssl.getBundle() != null && sslBundles != null) {
            SslBundle bundle = sslBundles.getBundle(ssl.getBundle());
            javaMailProperties.put("mail." + protocol + ".ssl.socketFactory",
                    bundle.createSslContext().getSocketFactory());
        }
        if (!javaMailProperties.isEmpty()) {
            sender.setJavaMailProperties(javaMailProperties);
        }
    }

    private Properties asProperties(Map<String, String> source) {
        Properties props = new Properties();
        props.putAll(source);
        return props;
    }
}
