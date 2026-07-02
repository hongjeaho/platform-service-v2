package com.platform.api.platform.users.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * OTP 발송 응답 DTO.
 */
@Schema(description = "OTP 발송 응답")
public record SendOtpResponse(
        @Schema(description = "응답 메시지", example = "OTP가 이메일로 발송되었습니다.")
        String message
) {
    /**
     * 성공 응답을 생성한다.
     *
     * @return "OTP가 이메일로 발송되었습니다." 메시지를 담은 응답
     */
    public static SendOtpResponse ofSuccess() {
        return new SendOtpResponse("OTP가 이메일로 발송되었습니다.");
    }
}
