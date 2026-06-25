package com.platform.api.platform.users.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "회원 등록 응답")
public class UsersSignupResponse {

    @Schema(description = "생성된 회원 일련번호", example = "1")
    private Long seq;

    @Schema(description = "사용자 아이디", example = "testuser")
    private String userId;

    @Schema(description = "사용자 이름", example = "홍길동")
    private String userName;
}
