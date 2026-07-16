package com.platform.api.platform.auth.codec;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.api.platform.auth.AuthUser;
import com.platform.api.platform.auth.BasicAuthority;
import java.util.Set;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class AuthUserTokenCodecTest {

    private final AuthUserTokenCodec codec = new AuthUserTokenCodec(new ObjectMapper());

    @Test
    @DisplayName("AuthUser → claims → AuthUser roundtrip이 사용자 정보를 보존한다")
    void roundTripPreservesUser() {
        var user = AuthUser.builder()
            .seq(1L)
            .userEmail("hong@platform.com")
            .userId("hong")
            .name("홍재호")
            .roles(Set.of(new BasicAuthority(1L, "ADMIN")))
            .build();

        var restored = codec.fromClaims(codec.toClaims(user));

        assertThat(restored).isInstanceOf(AuthUser.class);
        assertThat(restored).isEqualTo(user);
    }

    @Test
    @DisplayName("claims는 현행 토큰 스키마(seq·userEmail·userId·name·roles)를 유지하고 password를 싣지 않는다")
    void claimsKeepCurrentSchemaAndExcludePassword() {
        var user = AuthUser.builder()
            .seq(1L)
            .userEmail("hong@platform.com")
            .userId("hong")
            .name("홍재호")
            .password("encoded-secret")
            .roles(Set.of(new BasicAuthority(1L, "ADMIN")))
            .build();

        var claims = codec.toClaims(user);

        assertThat(claims)
            .containsKeys("seq", "userEmail", "userId", "name", "roles")
            .doesNotContainKey("password");
    }
}
