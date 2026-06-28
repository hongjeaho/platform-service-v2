package com.platform.api.platform.users.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "중복 확인 응답")
public record CheckDuplicateResponse(

        @Schema(description = "사용 가능 여부 (true: 사용 가능, false: 중복)", example = "true")
        boolean available,

        @Schema(description = "메시지", example = "사용 가능합니다.")
        String message
) {
    public static CheckDuplicateResponse ofAvailable() {
        return new CheckDuplicateResponse(true, "사용 가능합니다.");
    }

    public static CheckDuplicateResponse duplicate(String field) {
        return new CheckDuplicateResponse(false, "이미 사용 중인 " + field + "입니다.");
    }
}
