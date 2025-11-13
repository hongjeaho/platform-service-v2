package com.platform.datasource.platform.mapper.user;

import org.apache.ibatis.annotations.Mapper;
import com.platform.datasource.platform.jooq.generated.tables.pojos.UserEntity;

@Mapper
public interface UserMapper {

	UserEntity findUserByUserId(String userId);
}
