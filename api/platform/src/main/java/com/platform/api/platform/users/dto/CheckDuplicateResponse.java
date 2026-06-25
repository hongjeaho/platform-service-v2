package com.platform.api.platform.users.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "중복 확인 응답")
public class CheckDuplicateResponse {

    @Schema(description = "사용 가능 여부 (true: 사용 가능, false: 중복)", example = "true")
    private boolean available;

    @Schema(description = "메시지", example = "사용 가능합니다.")
    private String message;

    public static CheckDuplicateResponse available() {
        CheckDuplicateResponse response = new CheckDuplicateResponse();
        response.setAvailable(true);
        response.setMessage("사용 가능합니다.");
        return response;
    }

    public static CheckDuplicateResponse duplicate(String field) {
        CheckDuplicateResponse response = new CheckDuplicateResponse();
        response.setAvailable(false);
        response.setMessage("이미 사용 중인 " + field + "입니다.");
        return response;
    }
}
