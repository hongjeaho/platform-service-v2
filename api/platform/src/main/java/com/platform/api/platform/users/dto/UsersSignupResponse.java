package com.platform.api.platform.users.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "회원 등록 응답")
public record UsersSignupResponse(

        @Schema(description = "생성된 회원 일련번호", example = "1")
        Long seq,

        @Schema(description = "사용자 아이디", example = "testuser")
        String userId,

        @Schema(description = "사용자 이름", example = "홍길동")
        String userName
) {}
