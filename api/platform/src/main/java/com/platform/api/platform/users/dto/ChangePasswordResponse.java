package com.platform.api.platform.users.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "비밀번호 변경 응답")
public record ChangePasswordResponse(

        @Schema(description = "성공 여부", example = "true")
        boolean success,

        @Schema(description = "메시지", example = "비밀번호가 변경되었습니다.")
        String message
) {
    public static ChangePasswordResponse ofSuccess() {
        return new ChangePasswordResponse(true, "비밀번호가 변경되었습니다.");
    }
}
