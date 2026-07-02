package com.platform.api.platform.users.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "OTP 방식 비밀번호 변경 요청 (로그인 전)")
public record ChangePasswordWithOtpRequest(

        @NotBlank(message = "userEmail은 필수입니다.")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        @Schema(description = "사용자 이메일", example = "test@example.com")
        String userEmail,

        @NotBlank(message = "otpCode는 필수입니다.")
        @Size(min = 6, max = 6, message = "OTP는 6자리여야 합니다.")
        @Schema(description = "OTP 코드 (6자리)", example = "123456")
        String otpCode,

        @NotBlank(message = "newPassword는 필수입니다.")
        @Size(min = 8, max = 12, message = "비밀번호는 8~12자리여야 합니다.")
        @Schema(description = "새 비밀번호", example = "new12345")
        String newPassword
) {}