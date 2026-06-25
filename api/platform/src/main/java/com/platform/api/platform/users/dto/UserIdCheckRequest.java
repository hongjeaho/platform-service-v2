package com.platform.api.platform.users.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "아이디 중복 확인 요청")
public class UserIdCheckRequest {

    @NotBlank(message = "userId는 필수입니다.")
    @Size(max = 30, message = "userId는 30자 이하여야 합니다.")
    @Schema(description = "사용자 아이디", example = "testuser")
    private String userId;
}
