package com.platform.common.core.jwt;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

class JwtSessionManagerTest {

    private static final String SECRET = "test-secret";
    private static final String ISSUER = "test-issuer";
    private static final long ONE_HOUR = 60 * 60 * 1000L;
    private static final long ONE_MINUTE = 60 * 1000L;

    private final FakeCodec codec = new FakeCodec();

    @Test
    @DisplayName("발급한 토큰을 인증하면 principal이 그대로 복원된다")
    void issueThenAuthenticateRoundTrip() {
        var manager = new JwtSessionManager(SECRET, ISSUER, ONE_HOUR, ONE_MINUTE, codec);
        var principal = user("hong", "ADMIN");

        var token = manager.issue(principal);
        var session = manager.authenticate(token);

        assertThat(session).isPresent();
        assertThat(session.get().principal().getUsername()).isEqualTo("hong");
        assertThat(session.get().principal().getAuthorities())
            .extracting(GrantedAuthority::getAuthority)
            .containsExactly("ADMIN");
    }

    @Test
    @DisplayName("다른 secret으로 서명된 토큰은 인증에 실패한다")
    void forgedSignatureIsRejected() {
        var manager = new JwtSessionManager(SECRET, ISSUER, ONE_HOUR, ONE_MINUTE, codec);
        var forger = new JwtSessionManager("other-secret", ISSUER, ONE_HOUR, ONE_MINUTE, codec);

        var forgedToken = forger.issue(user("hong", "ADMIN"));

        assertThat(manager.authenticate(forgedToken)).isEmpty();
    }

    @Test
    @DisplayName("만료된 토큰은 인증에 실패한다")
    void expiredTokenIsRejected() {
        var expiredIssuer = new JwtSessionManager(SECRET, ISSUER, -1000L, ONE_MINUTE, codec);
        var manager = new JwtSessionManager(SECRET, ISSUER, ONE_HOUR, ONE_MINUTE, codec);

        var expiredToken = expiredIssuer.issue(user("hong", "ADMIN"));

        assertThat(manager.authenticate(expiredToken)).isEmpty();
    }

    @Test
    @DisplayName("다른 issuer의 토큰은 secret이 같아도 인증에 실패한다 — 인스턴스 간 교차 만족 차단")
    void differentIssuerIsRejected() {
        var manager = new JwtSessionManager(SECRET, ISSUER, ONE_HOUR, ONE_MINUTE, codec);
        var otherInstance = new JwtSessionManager(SECRET, "other-system", ONE_HOUR, ONE_MINUTE, codec);

        var foreignToken = otherInstance.issue(user("hong", "ADMIN"));

        assertThat(manager.authenticate(foreignToken)).isEmpty();
    }

    @Test
    @DisplayName("만료 임박 토큰을 인증하면 갱신 토큰이 함께 발급된다")
    void renewalTokenIssuedWhenExpiryImminent() {
        // 만료기간(1h) < 갱신 임계(2h) → 발급 즉시 갱신 윈도우 안
        var manager = new JwtSessionManager(SECRET, ISSUER, ONE_HOUR, 2 * ONE_HOUR, codec);

        var session = manager.authenticate(manager.issue(user("hong", "ADMIN")));

        assertThat(session).isPresent();
        assertThat(session.get().renewedToken()).isPresent();
        assertThat(manager.authenticate(session.get().renewedToken().get())).isPresent();
    }

    @Test
    @DisplayName("갱신 시점이 아직 아닌 토큰에는 갱신 토큰이 없다")
    void noRenewalTokenWhenFresh() {
        // 만료기간(1h) > 갱신 임계(1m) → 발급 직후는 갱신 윈도우 밖
        var manager = new JwtSessionManager(SECRET, ISSUER, ONE_HOUR, ONE_MINUTE, codec);

        var session = manager.authenticate(manager.issue(user("hong", "ADMIN")));

        assertThat(session).isPresent();
        assertThat(session.get().renewedToken()).isEmpty();
    }

    private static UserDetails user(String username, String... authorities) {
        return User.withUsername(username).password("").authorities(authorities).build();
    }

    /**
     * 테스트 전용 두 번째 adapter — seam을 real로 만든다.
     * principal의 shape는 kernel이 아닌 codec이 소유함을 보여준다.
     */
    private static final class FakeCodec implements TokenUserCodec {

        @Override
        public Map<String, Object> toClaims(UserDetails user) {
            return Map.of(
                "username", user.getUsername(),
                "authorities", user.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList()
            );
        }

        @Override
        @SuppressWarnings("unchecked")
        public UserDetails fromClaims(Map<String, Object> claims) {
            var authorities = (List<String>) claims.get("authorities");
            return User.withUsername((String) claims.get("username"))
                .password("")
                .authorities(authorities.toArray(String[]::new))
                .build();
        }
    }
}
