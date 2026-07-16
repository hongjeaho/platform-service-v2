package com.platform.common.core.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import java.util.Date;
import java.util.Optional;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * JWT 세션 kernel — 발급·검증·슬라이딩 윈도우 갱신 판단(ADR-0003)을 소유한다.
 *
 * <p>principal의 shape는 {@link TokenUserCodec}이 소유하며, kernel은
 * {@link UserDetails} 어휘만 안다. 설계 근거는 ADR-0004 참조.
 */
public class JwtSessionManager {

    private static final String USER_CLAIM = "user";

    private final Algorithm algorithm;
    private final String issuer;
    private final long expirationPeriodMillis;
    private final long renewBeforeMillis;
    private final TokenUserCodec codec;

    public JwtSessionManager(
        String secret,
        String issuer,
        long expirationPeriodMillis,
        long renewBeforeMillis,
        TokenUserCodec codec
    ) {
        this.algorithm = Algorithm.HMAC256(secret);
        this.issuer = issuer;
        this.expirationPeriodMillis = expirationPeriodMillis;
        this.renewBeforeMillis = renewBeforeMillis;
        this.codec = codec;
    }

    /** principal로 새 토큰을 발급한다. 만료기간은 kernel 설정이 소유한다. */
    public String issue(UserDetails user) {
        var now = System.currentTimeMillis();
        return JWT.create()
            .withIssuer(issuer)
            .withSubject(user.getUsername())
            .withIssuedAt(new Date(now))
            .withExpiresAt(new Date(now + expirationPeriodMillis))
            .withClaim(USER_CLAIM, codec.toClaims(user))
            .sign(algorithm);
    }

    /**
     * 토큰을 검증하고 principal을 복원한다. 만료·위조·issuer 불일치는 empty.
     * 갱신 시점이 도래한 토큰이면 {@link JwtSession#renewedToken()}에 새 토큰을 담는다.
     */
    public Optional<JwtSession> authenticate(String token) {
        try {
            var decoded = JWT.require(algorithm).withIssuer(issuer).build().verify(token);
            var principal = codec.fromClaims(decoded.getClaim(USER_CLAIM).asMap());
            return Optional.of(new JwtSession(principal, renewIfDue(decoded.getExpiresAt(), principal)));
        } catch (JWTVerificationException ex) {
            return Optional.empty();
        }
    }

    /** 슬라이딩 윈도우(ADR-0003): 남은 유효시간이 임계값 미만이면 새 토큰을 발급한다. */
    private Optional<String> renewIfDue(Date expiresAt, UserDetails principal) {
        var renewalDue = new Date(expiresAt.getTime() - renewBeforeMillis);
        if (new Date().after(renewalDue)) {
            return Optional.of(issue(principal));
        }
        return Optional.empty();
    }
}
