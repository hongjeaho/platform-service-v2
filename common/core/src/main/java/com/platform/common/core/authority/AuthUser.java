package com.platform.common.core.authority;

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
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * Spring Security 인증 주체(Principal)이자 API 응답용 사용자 정보 DTO.
 *
 * <p>{@link UserDetails}를 구현하여 Spring Security 인증 파이프라인과 통합된다.
 * JWT 토큰의 {@code user} 클레임으로 직렬화·역직렬화되며,
 * {@code password}는 {@code @JsonIgnore}로 응답에서 제외된다.
 *
 * <p>{@code success} 필드는 JWT 검증 결과를 나타내며, 토큰 파싱 후
 * {@link com.platform.common.core.util.JwtTokenUtil}이 내부적으로 설정한다.
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

    @Setter
    @JsonIgnore
    private boolean success;

    @Schema(description = "권한정보")
    @Builder.Default
    private Set<BasicAuthority> roles = Collections.emptySet();

    /**
     * DB 조회 결과로 사용자 객체를 생성한다.
     *
     * @param seq          사용자 일련번호
     * @param userEmail    이메일
     * @param userId       아이디
     * @param userPassword 암호화된 비밀번호
     * @param userName     사용자 이름
     */
    public AuthUser(Long seq, String userEmail, String userId, String userPassword, String userName) {
        this.seq = seq;
        this.userEmail = userEmail;
        this.userId = userId;
        this.name = userName;
        this.password = userPassword;
    }

    /**
     * 기존 사용자 정보에 권한을 추가하여 새 객체를 생성한다.
     *
     * <p>인증 후 권한 목록을 주입할 때 사용한다.
     *
     * @param authUser 권한 없는 사용자 정보
     * @param roles    부여할 권한 목록
     */
    public AuthUser(AuthUser authUser, Set<BasicAuthority> roles) {
        this.seq = authUser.getSeq();
        this.userEmail = authUser.getUserEmail();
        this.name = authUser.getName();
        this.userId = authUser.getUserId();
        this.password = authUser.getPassword();
        this.roles = roles;
    }

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