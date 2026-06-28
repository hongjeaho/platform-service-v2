package com.platform.api.platform.users.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "회원 등록 요청")
public record UsersSignupRequest(

        @NotBlank(message = "아이디는 필수입니다.")
        @Schema(description = "사용자 아이디", example = "testuser")
        String userId,

        @NotBlank(message = "이름은 필수입니다.")
        @Schema(description = "사용자 이름", example = "홍길동")
        String userName,

        @NotBlank(message = "비밀번호는 필수입니다.")
        @Schema(description = "비밀번호", example = "password123")
        String password,

        @NotBlank(message = "이메일은 필수입니다.")
        @Email(message = "올바른 이메일 형식이 아닙니다.")
        @Schema(description = "사용자 이메일", example = "user@example.com")
        String userEmail
) {}
