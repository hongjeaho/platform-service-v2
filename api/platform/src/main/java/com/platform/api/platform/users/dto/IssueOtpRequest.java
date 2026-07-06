package com.platform.api.platform.users.dto;

import com.platform.api.platform.users.type.OtpPurpose;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * OTP 발송 요청 DTO ({@code /api/public/otps}).
 */
@Schema(description = "OTP 발송 요청")
public record IssueOtpRequest(
        @NotBlank(message = "userEmail은 필수입니다.")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        @Schema(description = "사용자 이메일", example = "test@example.com")
        String userEmail,

        @NotNull(message = "purpose는 필수입니다.")
        @Schema(description = "OTP 용도", example = "SIGNUP")
        OtpPurpose purpose
) {
}
