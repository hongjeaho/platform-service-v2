package com.platform.common.web.config.filter;

import com.platform.common.core.jwt.JwtSessionManager;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * JWT 인증 서블릿 adapter — 헤더 I/O와 SecurityContext 등록만 담당한다.
 *
 * <p>검증·principal 복원·갱신 판단은 전부 {@link JwtSessionManager} kernel의 몫이다(ADR-0004).
 * 이 필터는 {@code TokenUserCodec} bean이 존재할 때만 등록된다 — 컴포넌트 스캔 대상이 아니다.
 */
@Slf4j
@RequiredArgsConstructor
public class JWTCheckFilter extends OncePerRequestFilter {

    private static final String SPACE = " ";

    private final JwtSessionManager jwtSessionManager;

    @Override
    protected void doFilterInternal(
        final HttpServletRequest request,
        @NonNull final HttpServletResponse response,
        @NonNull final FilterChain filterChain) throws ServletException, IOException {

        final var isPublic = request.getRequestURI().contains("/public/");
        if (isPublic) {
            filterChain.doFilter(request, response);
            return;
        }

        log.debug("METHOD={}, URI={}, Authorization=Bearer ***", request.getMethod(), request.getRequestURI());
        final var headerAuthorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (headerAuthorization == null || !headerAuthorization.startsWith("Bearer")
            || headerAuthorization.split(SPACE).length != 2) {
            filterChain.doFilter(request, response);
            return;
        }

        final var token = headerAuthorization.split(SPACE)[1].trim();
        final var session = jwtSessionManager.authenticate(token);

        if (session.isEmpty()) {
            log.error("토큰이 만료 되었습니다.");
            response.setHeader("X-Token-Expired", "true");
            filterChain.doFilter(request, response);
            return;
        }

        final var principal = session.get().principal();
        final var authentication = new UsernamePasswordAuthenticationToken(
            principal,
            null,
            principal.getAuthorities()
        );

        // 갱신 시점이 도래했다면 kernel이 발급한 새 토큰을 응답 헤더에 싣는다(ADR-0003).
        session.get().renewedToken()
            .ifPresent(renewed -> response.setHeader(HttpHeaders.AUTHORIZATION, renewed));

        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        filterChain.doFilter(request, response);
    }
}
