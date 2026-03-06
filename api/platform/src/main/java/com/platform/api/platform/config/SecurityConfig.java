package com.platform.api.platform.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.common.web.config.filter.JWTCheckFilter;
import com.platform.common.web.error.type.ErrorCode;
import com.platform.common.web.error.ErrorResponse;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer.FrameOptionsConfig;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

@EnableWebSecurity
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

  private final UserDetailsService userDetailsService;
  private final JWTCheckFilter jwtCheckFilter;
  private final OncePerRequestFilter platformHeaderFilter;
  private final ObjectMapper objectMapper;

  private static final List<String> ALLOWED_ORIGINS = List.of(
      "http://localhost",
      "http://localhost:3000",
      "https://dev.platform.go.kr"
  );

  public SecurityConfig(UserDetailsService userDetailsService, JWTCheckFilter jwtCheckFilter,
      @Qualifier("platformHeaderFilter") OncePerRequestFilter platformHeaderFilter,
      ObjectMapper objectMapper) {
    this.userDetailsService = userDetailsService;
    this.jwtCheckFilter = jwtCheckFilter;
    this.platformHeaderFilter = platformHeaderFilter;
    this.objectMapper = objectMapper;
  }

  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
    var authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
    authenticationManagerBuilder.userDetailsService(userDetailsService)
        .passwordEncoder(passwordEncoder());
    return authenticationManagerBuilder.build();
  }

  @Bean
  SecurityFilterChain configure(HttpSecurity http) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable)  // CSRF(Cross-Site Request Forgery) 보호를 비활성화
        .cors(security -> security.configurationSource(corsConfigurationSource())) // cors 설정
        .headers(headers -> headers
            .frameOptions(FrameOptionsConfig::deny) // Clickjacking 방지 (X-Frame-Options: DENY)
            .xssProtection(xss -> xss  // XSS 공격 방지
                .headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
            .contentTypeOptions(Customizer.withDefaults()) // MIME 스니핑 방지
            .referrerPolicy(referrer -> referrer  // Referrer 정책
                .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
            .contentSecurityPolicy(csp ->
                csp.policyDirectives("default-src 'self'; script-src 'self'; object-src 'none'"))
        )
        .exceptionHandling(security -> {
          security.authenticationEntryPoint(restAuthenticationEntryPoint());
          security.accessDeniedHandler(accessDeniedHandler());
        })
        .sessionManagement(session ->   // 세션 관리 정책을 설정
            session.sessionCreationPolicy(
                SessionCreationPolicy.STATELESS)) //  상태 없는(stateless) API로 동작
        .authorizeHttpRequests(authorizeRequests ->
            authorizeRequests
                .requestMatchers("/public/swagger-ui/**").permitAll()
                // Actuator 보안 강화: health 엔드포인트만 공개, 나머지는 인증 필요
                .requestMatchers("/public/platform/actuator/health", "/public/platform/actuator/health/**").permitAll()
                .requestMatchers("/public/platform/actuator/**").authenticated()
                .requestMatchers("/error", "/api/public/**").permitAll() // 인증 없이 접근 설정
                .anyRequest().authenticated()); //  모든 요청에 대해 인증을 요구하도록 설정

    // JWT 토큰 검증 처리
    http.addFilterBefore(platformHeaderFilter, UsernamePasswordAuthenticationFilter.class);
    http.addFilterAt(jwtCheckFilter, BasicAuthenticationFilter.class);

    // SecurityContextHolder는 기본 MODE_THREADLOCAL 사용
    // MODE_INHERITABLETHREADLOCAL은 스레드풀 환경에서 컨텍스트 누수 위험이 있어 제거
    return http.build();
  }

  // 권한 Prefix (default = ROLE_)
  @Bean
  GrantedAuthorityDefaults grantedAuthorityDefaults() {
    return new GrantedAuthorityDefaults("");
  }

  // 인증이 되지않은 유저가 요청을 했을때 동작
  private AuthenticationEntryPoint restAuthenticationEntryPoint() {
    return (request, response, ex) -> {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.setContentType(MediaType.APPLICATION_JSON_VALUE);
      response.setCharacterEncoding("UTF-8");
      objectMapper.writeValue(response.getWriter(),
          ErrorResponse.of(ErrorCode.AUTH_REQUIRED, "인증이 필요합니다."));
    };
  }

  //  권한을 체크후 액세스 할 수 없는 요청을 했을시 동작
  private AccessDeniedHandler accessDeniedHandler() {
    return (request, response, ex) -> {
      response.setStatus(HttpServletResponse.SC_FORBIDDEN);
      response.setContentType(MediaType.APPLICATION_JSON_VALUE);
      response.setCharacterEncoding("UTF-8");
      objectMapper.writeValue(response.getWriter(),
          ErrorResponse.of(ErrorCode.FORBIDDEN, "접근이 거부되었습니다."));
    };
  }

  // cors 설정
  private CorsConfigurationSource corsConfigurationSource() {
    var config = new CorsConfiguration();
    ALLOWED_ORIGINS.forEach(config::addAllowedOrigin);

    List.of("Authorization", "Content-Type", "x-token-expired", "Accept")
        .forEach(config::addAllowedHeader);
    List.of("GET", "POST", "PUT", "DELETE", "PATCH")
        .forEach(config::addAllowedMethod);

    // config.addExposedHeader("*");
    config.setExposedHeaders(
        List.of("Content-Disposition", "Content-Length", "Content-Type", "Authorization",
            "x-token-expired"));

    var source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);

    return source;
  }
}
