package com.platform.api.platform.users.controller;

import com.platform.api.platform.users.dto.ChangePasswordResponse;
import com.platform.api.platform.users.dto.ChangePasswordWithOtpRequest;
import com.platform.api.platform.users.dto.CheckDuplicateResponse;
import com.platform.api.platform.users.dto.SendOtpRequest;
import com.platform.api.platform.users.dto.SendOtpResponse;
import com.platform.api.platform.users.dto.UserEmailCheckRequest;
import com.platform.api.platform.users.dto.UserIdCheckRequest;
import com.platform.api.platform.users.dto.UsersSignupRequest;
import com.platform.api.platform.users.dto.UsersSignupResponse;
import com.platform.api.platform.users.service.OtpService;
import com.platform.api.platform.users.service.UsersService;
import com.platform.common.web.response.ApiResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "users", description = "회원 관리 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/users")
public class PublicUsersController {

    private final UsersService usersService;
    private final OtpService otpService;

    @Operation(summary = "회원 등록")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "등록 성공"),
        @ApiResponse(responseCode = "400", description = "입력값 오류"),
        @ApiResponse(responseCode = "409", description = "중복 아이디 또는 이메일")
    })
    @PostMapping
    public ResponseEntity<ApiResult<UsersSignupResponse>> signup(
        @RequestBody @Valid UsersSignupRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResult.of(usersService.signup(request)));
    }

    @Operation(summary = "아이디 중복 확인")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "사용 가능"),
        @ApiResponse(responseCode = "409", description = "중복"),
        @ApiResponse(responseCode = "400", description = "입력값 오류")
    })
    @PostMapping("/check-id")
    public ResponseEntity<ApiResult<CheckDuplicateResponse>> checkId(
        @RequestBody @Valid UserIdCheckRequest request
    ) {
        return ResponseEntity.ok(ApiResult.of(usersService.checkDuplicateUserId(request.userId())));
    }

    @Operation(summary = "이메일 중복 확인")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "사용 가능"),
        @ApiResponse(responseCode = "409", description = "중복"),
        @ApiResponse(responseCode = "400", description = "입력값 오류")
    })
    @PostMapping("/check-email")
    public ResponseEntity<ApiResult<CheckDuplicateResponse>> checkEmail(
        @RequestBody @Valid UserEmailCheckRequest request
    ) {
        return ResponseEntity.ok(ApiResult.of(usersService.checkDuplicateUserEmail(request.userEmail())));
    }

    @Operation(summary = "OTP 발송")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "발송 성공"),
        @ApiResponse(responseCode = "400", description = "입력값 오류 / 사용자 없음"),
        @ApiResponse(responseCode = "409", description = "재발송 간격 미달")
    })
    @PostMapping("/send-otp")
    public ResponseEntity<ApiResult<SendOtpResponse>> sendOtp(
        @RequestBody @Valid SendOtpRequest request
    ) {
        return ResponseEntity.ok(ApiResult.of(otpService.generateAndSave(request.userEmail())));
    }

    @Operation(summary = "비밀번호 변경 (로그인 전 - OTP 방식)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "변경 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 오류 / 사용자 없음 / OTP 만료 또는 불일치"),
            @ApiResponse(responseCode = "409", description = "현재 비밀번호와 동일")
    })
    @PostMapping("/change-password")
    public ResponseEntity<ApiResult<ChangePasswordResponse>> changePasswordBeforeLogin(
        @RequestBody @Valid ChangePasswordWithOtpRequest request
    ) {
        return ResponseEntity.ok(ApiResult.of(
            usersService.changePasswordBeforeLogin(
                request.userEmail(),
                request.newPassword(),
                request.otpCode()
            )
        ));
    }
}
