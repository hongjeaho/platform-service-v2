package com.platform.common.core.jwt;

import java.util.Map;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * 시스템의 인증 주체(principal)와 JWT claims 간 변환을 소유하는 도메인 제공 adapter.
 *
 * <p>kernel({@link JwtSessionManager})은 principal의 shape를 모른다 — 이 codec bean의
 * 존재 자체가 "이 시스템은 JWT 인증을 쓴다"는 선언이며, codec이 없는 시스템은
 * JWT 스택 없이 부팅된다. 설계 근거는 ADR-0004 참조.
 */
public interface TokenUserCodec {

    /** principal을 토큰에 실을 claims map으로 직렬화한다. */
    Map<String, Object> toClaims(UserDetails user);

    /** 토큰의 claims map에서 principal을 복원한다. */
    UserDetails fromClaims(Map<String, Object> claims);
}
