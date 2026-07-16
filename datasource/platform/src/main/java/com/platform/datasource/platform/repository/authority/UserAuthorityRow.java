package com.platform.datasource.platform.repository.authority;

/**
 * 사용자-권한 조인 조회 결과 한 행. principal 조립은 호출자(보안 adapter)의 책임이다(ADR-0004).
 */
public record UserAuthorityRow(
    Long seq,
    String userEmail,
    String userId,
    String userPassword,
    String userName,
    String roleName
) {
}
