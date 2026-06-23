package com.platform.api.platform.auth.controller;

import com.platform.api.platform.auth.service.AuthService;
import com.platform.common.core.authority.AuthRequest;
import com.platform.common.core.authority.AuthUser;
import com.platform.common.web.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 인증 관련 공개 API 컨트롤러.
 *
 * <p>인증 토큰 없이 접근 가능한 {@code /api/public/auth} 경로를 담당한다.
 */
@Tag(name = "Public Auth API", description = "인증 API")
@RestController
@RequestMapping("/api/public/auth")
@RequiredArgsConstructor
public class PublicAuthController {
    private final AuthService authService;

    /**
     * 아이디·비밀번호로 로그인하고 JWT 토큰을 발급한다.
     *
     * <p>응답 헤더 {@code Authorization}에 {@code Bearer <token>} 형식으로 토큰이 포함된다.
     *
     * @param authRequest 로그인 요청 정보 (아이디, 비밀번호)
     * @return 인증된 사용자 정보 — {@code Authorization} 헤더에 JWT 포함
     */
    @Operation(summary = "로그인 처리", description = "로그인 처리 후 인증된 정보를 내려준다.")
    @PostMapping
    public ResponseEntity<ApiResponse<AuthUser>> login(@RequestBody @Valid AuthRequest authRequest) {
        final var loginResponse = authService.login(authRequest);
        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, loginResponse.token())
                .body(ApiResponse.of(loginResponse.user()));
    }
}
