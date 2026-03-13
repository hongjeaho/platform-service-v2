package com.platform.datasource.platform.repository.authority;

import com.platform.common.core.authority.AuthUser;
import com.platform.common.core.authority.BasicAuthority;
import com.platform.common.core.authority.context.UserAccountHolder;
import com.platform.datasource.platform.jooq.generated.tables.JLtisCharge;
import com.platform.datasource.platform.jooq.generated.tables.JUser;
import com.platform.datasource.platform.jooq.generated.tables.JUserRole;
import com.platform.datasource.platform.jooq.generated.tables.JUserRoleMapping;
import com.platform.datasource.platform.jooq.generated.tables.pojos.UserEntity;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AuthorityRepository {

	private final DSLContext dslContext;
	private final JUser USER = JUser.USER;
	private final JUserRole USER_ROLE = JUserRole.USER_ROLE;
	private final JUserRoleMapping USER_ROLE_MAPPING = JUserRoleMapping.USER_ROLE_MAPPING;
	private final JLtisCharge LTIS_CHARGE = JLtisCharge.LTIS_CHARGE;

	/**
	 * 사용자 권한 정보를 조회 한다.
	 *
	 * @param id 사용자 아이디
	 * @return 사용자 권한 정보
	 */
	public AuthUser findAuthorById(String id) {
		Map<AuthUser, List<BasicAuthority>> userMap = dslContext.select(
				DSL.row(USER.SEQ, USER.USER_EMAIL, USER.USER_ID, USER.USER_PASSWORD, USER.USER_NAME).as("user"),
				DSL.row(USER_ROLE_MAPPING.USER_SEQ, USER_ROLE.USER_ROLE_NAME.as("role")).as("roles")
			)
			.from(USER)
			.join(USER_ROLE_MAPPING)
			.on(USER.SEQ.eq(USER_ROLE_MAPPING.USER_SEQ))
			.join(USER_ROLE)
			.on(USER_ROLE.SEQ.eq(USER_ROLE_MAPPING.ROLE_SEQ))
			.where(USER.USER_ID.eq(id))
			.fetchGroups(
				record -> record.get("user", AuthUser.class),
				record -> record.get("roles", BasicAuthority.class)
			);

		return userMap.entrySet().stream()
			.map(entry -> {
				Set<BasicAuthority> rolesSet = new HashSet<>(entry.getValue());  // List -> Set 변환
				return new AuthUser(entry.getKey(), rolesSet);  // AuthMember 생성
			})
			.findFirst()
			.orElseThrow(() -> new UsernameNotFoundException("id[" + id + "] not found."));
	}

	/**
	 * 해당 사건의 사업시행자 권한을 확인 한다.
	 *
	 * @param judgSeq 재결 일련번호
	 * @return 권한 여부
	 */
	public Boolean existsByImplementerByJudgSeq(Long judgSeq) {
		UserEntity implementer = dslContext.select(USER.fields())
			.from(USER)
			.join(LTIS_CHARGE).on(USER.USER_ID.eq(LTIS_CHARGE.IMPLEMENTER_ID))
			.where(LTIS_CHARGE.JUDG_SEQ.eq(judgSeq)
				.and(USER.SEQ.eq(UserAccountHolder.getSeqNo())))
			.fetchOneInto(UserEntity.class);

		return ObjectUtils.isNotEmpty(implementer);
	}
}
