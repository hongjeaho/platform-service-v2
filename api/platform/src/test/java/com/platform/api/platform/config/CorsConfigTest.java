package com.platform.api.platform.config;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.platform.api.platform.auth.controller.PublicAuthController;
import com.platform.api.platform.auth.service.AuthService;
import com.platform.common.web.config.filter.JWTCheckFilter;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * CORS 허용 origin이 프로퍼티({@code cors.allowed-origins})에서 주입되는지 검증한다(ADR-0006).
 * 필터 체인을 통과해야 하므로 addFilters를 끄지 않는다 — preflight는 CorsFilter가
 * JWT 필터보다 앞에서 즉시 응답하므로 mock 필터에 도달하지 않는다.
 */
@WebMvcTest(PublicAuthController.class)
@org.springframework.context.annotation.Import(SecurityConfig.class)
@TestPropertySource(properties = "cors.allowed-origins=http://allowed.example")
class CorsConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    // SecurityConfig 의존성 방지를 위한 MockitoBean
    @MockitoBean
    private UserDetailsService userDetailsService;
    @MockitoBean
    private JWTCheckFilter jwtCheckFilter;
    @MockitoBean
    @Qualifier("platformHeaderFilter")
    private OncePerRequestFilter platformHeaderFilter;

    @Test
    @DisplayName("프로퍼티에 선언된 origin의 preflight는 Access-Control-Allow-Origin으로 허용된다")
    void allowsOriginFromProperty() throws Exception {
        mockMvc.perform(options("/api/public/auth")
                .header(HttpHeaders.ORIGIN, "http://allowed.example")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
            .andExpect(status().isOk())
            .andExpect(header().string(
                HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://allowed.example"));
    }

    @Test
    @DisplayName("프로퍼티에 없는 origin의 preflight는 거부된다")
    void rejectsOriginNotInProperty() throws Exception {
        mockMvc.perform(options("/api/public/auth")
                .header(HttpHeaders.ORIGIN, "http://unknown.example")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
            .andExpect(status().isForbidden());
    }
}
