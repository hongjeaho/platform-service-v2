package com.platform.api.platform.auth.service;

import com.platform.api.platform.auth.AuthUser;
import com.platform.api.platform.auth.BasicAuthority;
import com.platform.datasource.platform.repository.authority.AuthorityRepository;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * 보안 adapter — 조회된 사용자-권한 row들을 {@link AuthUser} principal로 조립한다(ADR-0004).
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AuthorityRepository authorityRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var rows = authorityRepository.findAuthorityRowsById(username);
        if (rows.isEmpty()) {
            throw new UsernameNotFoundException("id[" + username + "] not found.");
        }

        var first = rows.get(0);
        var roles = rows.stream()
            .map(row -> new BasicAuthority(row.seq(), row.roleName()))
            .collect(Collectors.toSet());

        return AuthUser.builder()
            .seq(first.seq())
            .userEmail(first.userEmail())
            .userId(first.userId())
            .password(first.userPassword())
            .name(first.userName())
            .roles(roles)
            .build();
    }
}
