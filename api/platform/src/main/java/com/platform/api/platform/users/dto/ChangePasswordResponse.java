package com.platform.api.platform.users.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "비밀번호 변경 응답")
public class ChangePasswordResponse {

    @Schema(description = "성공 여부", example = "true")
    private boolean success;

    @Schema(description = "메시지", example = "비밀번호가 변경되었습니다.")
    private String message;

    public static ChangePasswordResponse success() {
        return new ChangePasswordResponse(true, "비밀번호가 변경되었습니다.");
    }

    public ChangePasswordResponse() {
    }

    public ChangePasswordResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}
