package com.platform.datasource.platform.repository.authority;

import com.platform.datasource.platform.jooq.generated.tables.JRoles;
import com.platform.datasource.platform.jooq.generated.tables.JUserRoles;
import com.platform.datasource.platform.jooq.generated.tables.JUsers;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AuthorityRepository {

	private final DSLContext dslContext;
	private final JUsers USERS = JUsers.USERS;
	private final JRoles ROLES = JRoles.ROLES;
	private final JUserRoles USER_ROLES = JUserRoles.USER_ROLES;

	/**
	 * 사용자와 권한을 조인해 행 단위로 조회한다. principal 조립은 호출자의 책임이다.
	 *
	 * @param id 사용자 아이디
	 * @return 권한별 한 행. 사용자가 없으면 빈 목록
	 */
	public List<UserAuthorityRow> findAuthorityRowsById(String id) {
		return dslContext.select(
				USERS.SEQ, USERS.USER_EMAIL, USERS.USER_ID, USERS.USER_PASSWORD, USERS.USER_NAME,
				ROLES.ROLE_NAME)
			.from(USERS)
			.join(USER_ROLES).on(USERS.SEQ.eq(USER_ROLES.USER_SEQ))
			.join(ROLES).on(ROLES.SEQ.eq(USER_ROLES.ROLE_SEQ))
			.where(USERS.USER_ID.eq(id))
			.fetchInto(UserAuthorityRow.class);
	}
}
