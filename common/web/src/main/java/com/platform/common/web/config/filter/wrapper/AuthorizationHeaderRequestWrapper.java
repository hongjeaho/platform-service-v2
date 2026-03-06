package com.platform.common.web.config.filter.wrapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import org.springframework.http.HttpHeaders;
import org.springframework.util.StringUtils;

public class AuthorizationHeaderRequestWrapper extends HttpServletRequestWrapper {

  private final String authorizationValue;

  public AuthorizationHeaderRequestWrapper(
      final HttpServletRequest request,
      final String authorizationValue) {
    super(request);
    this.authorizationValue = authorizationValue;
  }

  @Override
  public String getHeader(final String name) {
    var superValue = super.getHeader(name);
    if (HttpHeaders.AUTHORIZATION.equals(name) && !StringUtils.hasText(superValue)) {
      return authorizationValue;
    }

    return superValue;
  }

}
