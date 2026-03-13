package com.platform.common.core.authority.context;

import com.platform.common.core.authority.AuthUser;
import com.platform.common.core.authority.BasicAuthority;
import java.util.Optional;
import java.util.Set;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;

public class UserAccountHolder {
    private UserAccountHolder() {
        throw new UnsupportedOperationException();
    }

    public static AuthUser get() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        return Optional.ofNullable(authentication)
                .map(Authentication::getPrincipal)
                .filter(auth -> auth instanceof AuthUser)
                .map(principal -> (AuthUser) principal)
                .orElseThrow(() -> new AuthenticationException("Cannot get a user account") {
                });
    }

    public static <T extends AuthUser> T get(final Class<T> type) {
        return type.cast(get());
    }

    /**
     * 사용자 일련 번호를 반환 한다.
     *
     * @return 사용자 일련번호
     */
    public static Long getSeqNo() {
        return get().getSeq();
    }

    /**
     * 사용자 권한 정보를 반환 한다.
     *
     * @return 사용자 권한 정보
     */
    public static Set<BasicAuthority> getRoles() {
        return get().getRoles();
    }

    /**
     * 사용자 아이디를 반환 한다.
     *
     * @return 사용자 사용자 아이디
     */
    public static String getUserId() {
        return get().getUserId();
    }
}
