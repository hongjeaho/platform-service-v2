package com.platform.api.platform.users.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "비밀번호 변경 요청 (로그인 전)")
public class ChangePasswordBeforeLoginRequest {

    @NotBlank(message = "userEmail은 필수입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    @Schema(description = "사용자 이메일", example = "test@example.com")
    private String userEmail;

    @NotBlank(message = "currentPassword는 필수입니다.")
    @Schema(description = "현재 비밀번호", example = "current123")
    private String currentPassword;

    @NotBlank(message = "newPassword는 필수입니다.")
    @Size(min = 8, max = 12, message = "비밀번호는 8~12자리여야 합니다.")
    @Schema(description = "새 비밀번호", example = "new12345")
    private String newPassword;
}
