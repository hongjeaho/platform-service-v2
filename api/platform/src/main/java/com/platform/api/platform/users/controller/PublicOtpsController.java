package com.platform.api.platform.users.controller;

import com.platform.api.platform.users.dto.IssueOtpRequest;
import com.platform.api.platform.users.dto.SendOtpResponse;
import com.platform.api.platform.users.service.UsersService;
import com.platform.common.web.response.ApiResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * OTP 발송 공개 API 컨트롤러.
 *
 * <p>{@code /api/public/otps} 경로를 담당하며, purpose에 따라 {@link UsersService}가 소유한
 * 사전조건 검증 메서드로 위임한다(ADR-0001).
 */
@Tag(name = "otps", description = "OTP 발송 API")
@RestController
@RequestMapping("/api/public/otps")
@RequiredArgsConstructor
public class PublicOtpsController {

    private final UsersService usersService;

    @Operation(summary = "OTP 발송")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "발송 성공"),
        @ApiResponse(responseCode = "400", description = "입력값 오류 / 사용자 없음"),
        @ApiResponse(responseCode = "409", description = "이미 가입된 이메일 / 재발송 간격 미달")
    })
    @PostMapping
    public ResponseEntity<ApiResult<SendOtpResponse>> issueOtp(
        @RequestBody @Valid IssueOtpRequest request
    ) {
        SendOtpResponse response = switch (request.purpose()) {
            case SIGNUP -> usersService.sendSignupOtp(request.userEmail());
            case PASSWORD_CHANGE -> usersService.sendPasswordChangeOtp(request.userEmail());
        };
        return ResponseEntity.ok(ApiResult.of(response));
    }
}
