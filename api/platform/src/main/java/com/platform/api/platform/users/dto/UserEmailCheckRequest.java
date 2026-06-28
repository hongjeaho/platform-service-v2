package com.platform.api.platform.users.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "이메일 중복 확인 요청")
public record UserEmailCheckRequest(

        @NotBlank(message = "userEmail은 필수입니다.")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        @Size(max = 100, message = "userEmail은 100자 이하여야 합니다.")
        @Schema(description = "사용자 이메일", example = "test@example.com")
        String userEmail
) {}
