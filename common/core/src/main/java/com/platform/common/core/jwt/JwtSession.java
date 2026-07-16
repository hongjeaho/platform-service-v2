package com.platform.common.core.jwt;

import java.util.Optional;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * 인증 성공 결과 — 복원된 principal과, 갱신 시점이 도래했다면 새로 발급된 토큰.
 *
 * @param principal    토큰에서 복원된 인증 주체
 * @param renewedToken 슬라이딩 윈도우(ADR-0003) 갱신 시점 도래 시 새 토큰, 아니면 empty
 */
public record JwtSession(UserDetails principal, Optional<String> renewedToken) {
}
