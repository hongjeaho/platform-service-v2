package com.platform.datasource.platform.repository.users;

import com.platform.datasource.platform.jooq.generated.tables.JRoles;
import com.platform.datasource.platform.jooq.generated.tables.JUserRoles;
import com.platform.datasource.platform.jooq.generated.tables.JUsers;
import com.platform.datasource.platform.jooq.generated.tables.pojos.UsersEntity;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UsersRepository {

    private final DSLContext dslContext;

    private final JUsers USERS = JUsers.USERS;
    private final JRoles ROLES = JRoles.ROLES;
    private final JUserRoles USER_ROLES = JUserRoles.USER_ROLES;

    public boolean existsByUserId(String userId) {
        return dslContext.fetchExists(
            dslContext.selectOne()
                .from(USERS)
                .where(USERS.USER_ID.eq(userId))
        );
    }

    public boolean existsByEmail(String email) {
        return dslContext.fetchExists(
            dslContext.selectOne()
                .from(USERS)
                .where(USERS.USER_EMAIL.eq(email))
        );
    }

    public Long insertUser(UsersEntity user) {
        return dslContext.insertInto(USERS)
            .set(USERS.USER_ID, user.getUserId())
            .set(USERS.USER_NAME, user.getUserName())
            .set(USERS.USER_EMAIL, user.getUserEmail())
            .set(USERS.USER_PASSWORD, user.getUserPassword())
            .set(USERS.CREATED_BY, user.getCreatedBy())
            .returningResult(USERS.SEQ)
            .fetchOneInto(Long.class);
    }

    public Long findRoleSeqByName(String roleName) {
        return dslContext.select(ROLES.SEQ)
            .from(ROLES)
            .where(ROLES.ROLE_NAME.eq(roleName))
            .fetchOneInto(Long.class);
    }

    public void insertUserRole(long userSeq, long roleSeq, long createdBy) {
        dslContext.insertInto(USER_ROLES)
            .set(USER_ROLES.USER_SEQ, userSeq)
            .set(USER_ROLES.ROLE_SEQ, roleSeq)
            .set(USER_ROLES.CREATED_BY, createdBy)
            .execute();
    }

    // ========== 이슈 #3: 비밀번호 변경 API (로그인 전) ==========

    public UsersEntity findByUserEmail(String userEmail) {
        return dslContext.selectFrom(USERS)
            .where(USERS.USER_EMAIL.eq(userEmail))
            .fetchOneInto(UsersEntity.class);
    }

    public void updatePassword(Long seq, String newPassword, Long updatedBy) {
        dslContext.update(USERS)
            .set(USERS.USER_PASSWORD, newPassword)
            .set(USERS.PASSWORD_CHANGED_TIME, java.time.LocalDateTime.now())
            .set(USERS.UPDATED_BY, updatedBy)
            .set(USERS.UPDATED_TIME, java.time.LocalDateTime.now())
            .where(USERS.SEQ.eq(seq))
            .execute();
    }

    // ========== 이슈 #4: 비밀번호 변경 API (로그인 후) ==========

    public UsersEntity findBySeq(Long seq) {
        return dslContext.selectFrom(USERS)
            .where(USERS.SEQ.eq(seq))
            .fetchOneInto(UsersEntity.class);
    }
}
