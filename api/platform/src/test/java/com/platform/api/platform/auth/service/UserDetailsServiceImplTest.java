package com.platform.api.platform.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

import com.platform.common.core.auth.AuthUser;
import com.platform.datasource.platform.repository.authority.AuthorityRepository;
import com.platform.datasource.platform.repository.authority.UserAuthorityRow;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private AuthorityRepository authorityRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @Test
    @DisplayName("조회된 row들이 AuthUser와 권한 집합으로 조립된다")
    void assemblesAuthUserFromRows() {
        given(authorityRepository.findAuthorityRowsById("hong")).willReturn(List.of(
            new UserAuthorityRow(1L, "hong@platform.com", "hong", "encoded", "홍재호", "ADMIN"),
            new UserAuthorityRow(1L, "hong@platform.com", "hong", "encoded", "홍재호", "USER")
        ));

        var details = userDetailsService.loadUserByUsername("hong");

        assertThat(details).isInstanceOf(AuthUser.class);
        var authUser = (AuthUser) details;
        assertThat(authUser.getSeq()).isEqualTo(1L);
        assertThat(authUser.getUserEmail()).isEqualTo("hong@platform.com");
        assertThat(authUser.getName()).isEqualTo("홍재호");
        assertThat(authUser.getPassword()).isEqualTo("encoded");
        assertThat(authUser.getAuthorities())
            .extracting(GrantedAuthority::getAuthority)
            .containsExactlyInAnyOrder("ADMIN", "USER");
    }

    @Test
    @DisplayName("row가 없으면 UsernameNotFoundException을 던진다")
    void throwsWhenUserNotFound() {
        given(authorityRepository.findAuthorityRowsById("none")).willReturn(List.of());

        assertThatThrownBy(() -> userDetailsService.loadUserByUsername("none"))
            .isInstanceOf(UsernameNotFoundException.class);
    }
}
