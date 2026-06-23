package com.platform.api.platform.auth.dto;

import com.platform.common.core.auth.AuthUser;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 로그인 성공 응답 데이터.
 *
 * <p>서비스 계층에서 컨트롤러로 토큰과 사용자 정보를 함께 전달하기 위한 내부 DTO다.
 * 토큰은 HTTP {@code Authorization} 헤더로, 사용자 정보는 응답 바디로 각각 전달된다.
 *
 * @param token JWT 액세스 토큰 ({@code Bearer} 접두사 미포함)
 * @param user  인증된 사용자 정보
 */
@Schema(name = "LoginResponse", description = "로그인 응답 정보")
public record LoginResponse(
    @Schema(description = "JWT 액세스 토큰") String token,
    @Schema(description = "인증된 사용자 정보") AuthUser user
) {}
