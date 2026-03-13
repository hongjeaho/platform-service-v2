package com.platform.common.web.config.filter;


import com.platform.common.web.config.filter.wrapper.AuthorizationHeaderRequestWrapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

@Profile("local")
@Component("platformHeaderFilter")
@RequiredArgsConstructor
public class PlatformLocalHeaderFilter extends OncePerRequestFilter {

  private final String createSwaggerJwtToken;

  @Override
  protected void doFilterInternal(
      @NonNull final HttpServletRequest request,
      @NonNull final HttpServletResponse response,
      final FilterChain filterChain) throws ServletException, IOException {
    filterChain.doFilter(getCustomAuthorizationRequest(request), response);
  }

  private HttpServletRequest getCustomAuthorizationRequest(HttpServletRequest request) {
    final boolean isPublicUri = new AntPathMatcher().match(
        "/api/public/**",
        request.getRequestURI()
    );

    return isSwagger(request) && !isPublicUri
        ? new AuthorizationHeaderRequestWrapper(request, this.createSwaggerJwtToken)
        : request;
  }

  private boolean isSwagger(HttpServletRequest request) {
    final var referer = request.getHeader(HttpHeaders.REFERER);
    return referer != null && referer.contains("/public/swagger-ui/");
  }
}
