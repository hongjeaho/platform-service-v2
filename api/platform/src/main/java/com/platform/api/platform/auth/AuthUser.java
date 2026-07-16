package com.platform.api.platform.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * Spring Security 인증 주체(Principal)이자 API 응답용 사용자 정보 DTO.
 *
 * <p>{@link UserDetails}를 구현하여 Spring Security 인증 파이프라인과 통합된다.
 * JWT 토큰의 {@code user} 클레임으로 직렬화·역직렬화되며(회원 codec — ADR-0004),
 * {@code password}는 {@code @JsonIgnore}로 응답에서 제외된다.
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@EqualsAndHashCode
@Schema(name = "AuthUser", description = "인증 정보")
public class AuthUser implements UserDetails {

    @Schema(description = "사용자 일련번호")
    private Long seq;
    @Schema(description = "email")
    private String userEmail;
    @Schema(description = "id")
    private String userId;
    @Schema(description = "사용자 이름")
    private String name;
    @JsonIgnore
    private String password;

    @Schema(description = "권한정보")
    @Builder.Default
    private Set<BasicAuthority> roles = Collections.emptySet();

    @JsonIgnore
    @Override
    public String getUsername() {
        return userId;
    }

    @JsonIgnore
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (roles == null || roles.isEmpty()) {
            return List.of();
        }

        return roles.stream()
            .map(userRole -> new SimpleGrantedAuthority(userRole.getAuthority()))
            .collect(Collectors.toList());
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isEnabled() {
        return true;
    }
}