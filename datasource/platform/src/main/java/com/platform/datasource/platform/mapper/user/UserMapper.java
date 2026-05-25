package com.platform.datasource.platform.mapper.user;

import org.apache.ibatis.annotations.Mapper;
import com.platform.datasource.platform.jooq.generated.tables.pojos.UsersEntity;

@Mapper
public interface UserMapper {

	UsersEntity findUserByUserId(String userId);
}
