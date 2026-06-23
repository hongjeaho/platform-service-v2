package com.platform.datasource.platform.repository.authority;

import com.platform.common.core.auth.AuthUser;
import com.platform.common.core.auth.BasicAuthority;
import com.platform.datasource.platform.jooq.generated.tables.JRoles;
import com.platform.datasource.platform.jooq.generated.tables.JUserRoles;
import com.platform.datasource.platform.jooq.generated.tables.JUsers;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AuthorityRepository {

	private final DSLContext dslContext;
	private final JUsers USERS = JUsers.USERS;
	private final JRoles ROLES = JRoles.ROLES;
	private final JUserRoles USER_ROLES = JUserRoles.USER_ROLES;

	/**
	 * 사용자 권한 정보를 조회 한다.
	 *
	 * @param id 사용자 아이디
	 * @return 사용자 권한 정보
	 */
	public AuthUser findAuthorById(String id) {
		Map<AuthUser, List<BasicAuthority>> userMap = dslContext.select(
				DSL.row(USERS.SEQ, USERS.USER_EMAIL, USERS.USER_ID, USERS.USER_PASSWORD, USERS.USER_NAME).as("user"),
				DSL.row(USER_ROLES.USER_SEQ, ROLES.USER_ROLE_NAME.as("role")).as("roles")
			)
			.from(USERS)
			.join(USER_ROLES).on(USERS.SEQ.eq(USER_ROLES.USER_SEQ))
			.join(ROLES).on(ROLES.SEQ.eq(USER_ROLES.ROLE_SEQ))
			.where(USERS.USER_ID.eq(id))
			.fetchGroups(
				record -> record.get("user", AuthUser.class),
				record -> record.get("roles", BasicAuthority.class)
			);

		return userMap.entrySet().stream()
			.map(entry -> {
				Set<BasicAuthority> rolesSet = new HashSet<>(entry.getValue());
				return new AuthUser(entry.getKey(), rolesSet);
			})
			.findFirst()
			.orElseThrow(() -> new UsernameNotFoundException("id[" + id + "] not found."));
	}
}
